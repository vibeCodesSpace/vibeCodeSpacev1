// vibeCodeSpace_clone/backend/src/lib/geminiClient.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Instructions for Setting Up the Gemini API Key ---
// 1. Go to Google AI Studio: https://aistudio.google.com/
// 2. Click "Get API key" and create a new API key in a project.
// 3. Copy the API key.
// 4. Add it to your .env file as:
//    GEMINI_API_KEY=your_api_key_here

// 1. Initialize the GoogleGenerativeAI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates text using a specified Gemini model.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {string} [modelName='gemini-1.5-flash'] The model to use for the generation.
 * @returns {Promise<string>} The generated text content.
 * @throws {Error} If the API call fails or returns no content.
 */
async function generateText(prompt, modelName = "gemini-1.5-flash") {
  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No content returned from Gemini.");
    }

    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate text from Gemini.");
  }
}

/**
 * Generates code using a specified Gemini model.
 *
 * @param {string} description The description of the code to generate.
 * @param {string} [language='javascript'] The programming language for the code.
 * @param {string} [modelName='gemini-1.5-flash'] The model to use.
 * @returns {Promise<string>} The generated code.
 */
async function generateCode(
  description,
  language = "javascript",
  modelName = "gemini-1.5-flash",
) {
  const prompt = `Generate a ${language} code snippet for the following description: ${description}. Only output the raw code, without any markdown formatting, explanations, or example usage.`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No code returned from Gemini.");
    }

    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for code generation:", error);
    throw new Error("Failed to generate code from Gemini.");
  }
}

module.exports = {
  generateText,
  generateCode,
};
