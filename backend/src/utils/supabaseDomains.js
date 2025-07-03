// vibeCodeSpace_clone/backend/src/utils/supabaseDomains.js
const axios = require('axios');

/**
 * Programmatically assigns a custom subdomain to your Supabase project.
 *
 * @param {string} subdomain The full subdomain to assign (e.g., 'new-app.vibecodes.space').
 * @returns {Promise<object>} The response from the Supabase Management API.
 * @throws {Error} If the API call fails.
 */
async function assignSupabaseSubdomain(subdomain) {
  const projectRef = process.env.SUPABASE_PROJECT_REF; // Your project ID from the dashboard URL
  const apiToken = process.env.SUPABASE_MANAGEMENT_TOKEN;

  if (!projectRef || !apiToken) {
    throw new Error('Supabase project reference and management token must be configured.');
  }

  const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/custom-domains`;

  try {
    console.log(`[Domains] Assigning subdomain: ${subdomain} to project: ${projectRef}`);
    
    const response = await axios.post(
      apiUrl,
      { custom_domain: subdomain },
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[Domains] Successfully assigned subdomain: ${subdomain}`);
    return response.data;
  } catch (error) {
    console.error('Error assigning Supabase subdomain:', error.response?.data || error.message);
    throw new Error('Failed to assign Supabase subdomain.');
  }
}

module.exports = { assignSupabaseSubdomain };
