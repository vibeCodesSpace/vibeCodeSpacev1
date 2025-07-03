// vibeCodeSpace_clone/backend/src/lib/claudeClient.js
const Anthropic = require('@anthropic-ai/sdk');

// 1. Initialize the Anthropic client with the API key from environment variables
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

/**
 * Generates text using a specified Claude model.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {string} [model='claude-3-opus-20240229'] The model to use for the generation.
 * @returns {Promise<string>} The generated text content.
 * @throws {Error} If the API call fails, returns no content, or hits a rate limit.
 */
async function generateText(prompt, model = 'claude-3-opus-20240229') {
    if (!prompt) {
        throw new Error('Prompt is required.');
    }

    try {
        const message = await anthropic.messages.create({
            model: model,
            max_tokens: 4096, // Adjust as needed
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const content = message.content[0]?.text;
        if (!content) {
            throw new Error('No content returned from Claude.');
        }

        return content.trim();
    } catch (error) {
        // Specific handling for different error types from the Anthropic SDK
        if (error instanceof Anthropic.APIError) {
            console.error(`Claude API Error: ${error.status} ${error.name}`, error.message);
            if (error.status === 429) {
                // Rate limit error
                throw new Error('Rate limit exceeded for Claude API. Please try again later.');
            }
            throw new Error(`Claude API Error: ${error.message}`);
        } else {
            console.error('An unexpected error occurred calling the Claude API:', error);
            throw new Error('Failed to generate text from Claude.');
        }
    }
}

module.exports = {
    generateText,
    anthropic, // Export the client for more advanced use cases
};
