// vibeCodeSpace_clone/backend/src/lib/openaiClient.js
const OpenAI = require('openai');

// 1. Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates text using a specified OpenAI model.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {string} [model='gpt-4o'] The model to use for the generation.
 * @returns {Promise<string>} The generated text content.
 * @throws {Error} If the API call fails or returns no content.
 */
async function generateText(prompt, model = 'gpt-4o') {
    if (!prompt) {
        throw new Error('Prompt is required.');
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant designed to generate code and text.',
                },
                { role: 'user', content: prompt },
            ],
            model: model,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content returned from OpenAI.');
        }

        return content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        // Re-throw the error to be handled by the caller
        throw new Error('Failed to generate text from OpenAI.');
    }
}

/**
 * A more specific function for generating code snippets.
 * It uses a system prompt tailored for code generation.
 *
 * @param {string} description The description of the code to generate.
 * @param {string} [language='javascript'] The programming language for the code.
 * @param {string} [model='gpt-4o'] The model to use.
 * @returns {Promise<string>} The generated code.
 */
async function generateCode(description, language = 'javascript', model = 'gpt-4o') {
    const prompt = `Generate a ${language} code snippet for the following description: ${description}`;
    
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert programmer. Generate only the raw code for the following request, without any markdown formatting, explanations, or example usage.`,
                },
                { role: 'user', content: prompt },
            ],
            model: model,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No code returned from OpenAI.');
        }

        return content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API for code generation:', error);
        throw new Error('Failed to generate code from OpenAI.');
    }
}


module.exports = {
    generateText,
    generateCode,
    // You can export the client itself if you need to access other OpenAI features
    openai,
};
