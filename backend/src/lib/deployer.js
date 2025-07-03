// vibeCodeSpace_clone/backend/src/lib/deployer.js
const { Octokit } = require('@octokit/rest');
const simpleGit = require('simple-git');
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_OWNER_ID = process.env.RENDER_OWNER_ID; // Your Render owner ID (e.g., 'usr-...')

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const git = simpleGit();

/**
 * Deploys a generated application to Render.
 * @param {string} sessionId The unique ID for the generation session.
 * @param {object} appCode The generated application code.
 * @returns {Promise<object>} An object containing the URLs of the deployed services.
 */
async function deployToRender(sessionId, appCode) {
    const repoName = `vibecode-app-${sessionId}`;
    
    // 1. Create a new private GitHub repository
    console.log(`[Deployer] Creating GitHub repo: ${repoName}`);
    const repo = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: true,
    });
    const repoUrl = repo.data.clone_url;

    // 2. Push the generated code to the new repository
    console.log(`[Deployer] Pushing code to ${repoUrl}`);
    await pushCodeToRepo(repoUrl, appCode);

    // 3. Create the Render services
    console.log(`[Deployer] Creating Render services for ${repoName}`);
    const { frontendUrl, backendUrl } = await createRenderServices(repoName, repo.data.id);

    return { frontendUrl, backendUrl };
}

/**
 * Pushes the generated code to a new GitHub repository.
 */
async function pushCodeToRepo(repoUrl, appCode) {
    const tempDir = path.join(__dirname, 'temp-deploys', Date.now().toString());
    await fs.mkdir(tempDir, { recursive: true });

    // Write the code to files
    await fs.writeFile(path.join(tempDir, 'index.html'), appCode.frontend.html);
    await fs.writeFile(path.join(tempDir, 'styles.css'), appCode.frontend.css);
    await fs.writeFile(path.join(tempDir, 'script.js'), appCode.frontend.javascript);
    await fs.writeFile(path.join(tempDir, 'server.js'), appCode.backend['server.js']);
    
    // Git operations
    await git.cwd(tempDir).init().add('./*').commit('Initial commit').addRemote('origin', repoUrl).push('origin', 'master', { '--set-upstream': null });

    // Clean up the temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
}

/**
 * Creates the necessary services on Render via their API.
 */
async function createRenderServices(repoName, repoId) {
    const renderApi = axios.create({
        baseURL: 'https://api.render.com/v1',
        headers: { 'Authorization': `Bearer ${RENDER_API_KEY}` },
    });

    // Create a static site for the frontend
    const frontendService = await renderApi.post('/services', {
        type: 'static_site',
        name: `${repoName}-frontend`,
        ownerId: RENDER_OWNER_ID,
        repo: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
        autoDeploy: 'yes',
        branch: 'master',
        buildCommand: 'echo "No build command needed"',
        publishPath: '.',
    });

    // Create a web service for the backend
    const backendService = await renderApi.post('/services', {
        type: 'web_service',
        name: `${repoName}-backend`,
        ownerId: RENDER_OWNER_ID,
        repo: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
        autoDeploy: 'yes',
        branch: 'master',
        serviceDetails: {
            env: 'node',
            buildCommand: 'npm install',
            startCommand: 'node server.js',
        },
    });

    return {
        frontendUrl: frontendService.data.serviceDetails.url,
        backendUrl: backendService.data.serviceDetails.url,
    };
}

module.exports = { deployToRender };
