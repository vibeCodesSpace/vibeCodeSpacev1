// vibeCodeSpace_clone/backend/src/lib/aiOrchestrator.js
const OpenaiClient = require("./openaiClient");
const ClaudeClient = require("./claudeClient");
const GeminiClient = require("./geminiClient");
const { assignSupabaseSubdomain } = require("../utils/supabaseDomains");
const { deployToRender } = require("./deployer"); // Import the new deployer

// A simple in-memory store for generated code. In a real app, use a database or blob storage.
const generatedCodeStore = new Map();

/**
 * The main orchestration function for generating a web application.
 *
 * @param {string} initialPrompt The user's initial description of the app.
 * @param {string} sessionId A unique ID for the generation session.
 * @returns {Promise<object>} A structured object containing the generated code.
 */
async function generateApplication(initialPrompt, sessionId) {
  console.log(`[Orchestrator] Starting generation for session: ${sessionId}`);

  let conversationHistory = [
    { role: "user", content: getInitialSystemPrompt(initialPrompt) },
  ];
  let isDone = false;
  let generatedApp = null;
  let attempts = 0;
  const MAX_ATTEMPTS = 5; // Prevents infinite loops

  while (!isDone && attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`[Orchestrator] Attempt #${attempts}`);

    // For this crucial task, we'll use the most powerful model available.
    const aiResponse = await OpenaiClient.generateText(
      JSON.stringify(conversationHistory),
      "gpt-4o",
    );

    try {
      const parsedResponse = JSON.parse(aiResponse);

      if (parsedResponse.status === "requires_clarification") {
        console.log(
          "[Orchestrator] AI requires clarification. Sending follow-up questions.",
        );
        // In a real app, you would send these questions to the user and get their answers.
        // For this simulation, we'll auto-answer them to continue the loop.
        const answers = autoAnswerQuestions(parsedResponse.questions);
        conversationHistory.push({ role: "assistant", content: aiResponse }); // Add AI's questions
        conversationHistory.push({
          role: "user",
          content: JSON.stringify(answers),
        }); // Add user's answers
      } else if (parsedResponse.status === "complete") {
        console.log("[Orchestrator] AI generation complete.");
        isDone = true;
        generatedApp = parsedResponse.application;

        // --- New Subdomain Logic ---
        const subdomain = `${generatedApp.name.toLowerCase().replace(/\s+/g, "-")}-${sessionId}.vibecodes.space`;
        generatedApp.subdomain = subdomain;
        await assignSupabaseSubdomain(subdomain);
        // --- End New Subdomain Logic ---

        // Store the generated code
        await storeGeneratedCode(sessionId, generatedApp);

        // --- Trigger Deployment Asynchronously ---
        console.log(
          `[Orchestrator] Triggering deployment for session: ${sessionId}`,
        );
        deployToRender(sessionId, generatedApp).catch((err) => {
          console.error(
            `[Deployer] Deployment failed for session ${sessionId}:`,
            err,
          );
        });
        // --- End Trigger Deployment ---
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (error) {
      console.error(
        "[Orchestrator] Error parsing AI response. Retrying with feedback.",
      );
      // If parsing fails, tell the AI to correct its format.
      conversationHistory.push({ role: "assistant", content: aiResponse });
      conversationHistory.push({
        role: "user",
        content:
          "Your last response was not valid JSON. Please provide your response in the specified JSON format.",
      });
    }
  }

  if (!generatedApp) {
    throw new Error("Failed to generate application after multiple attempts.");
  }

  return generatedApp;
}

/**
 * Creates the initial, detailed system prompt for the AI.
 * This is critical for guiding the AI to produce a unique, complete application.
 */
function getInitialSystemPrompt(prompt) {
  return `
        You are an expert full-stack web developer AI. Your task is to generate a complete, unique, and functional web application based on a user's prompt.

        **Output Format:**
        Your response MUST be a single, valid JSON object. Do not include any text or markdown outside of this JSON object.

        **If you have clarifying questions:**
        Return a JSON object with the format:
        {
            "status": "requires_clarification",
            "questions": ["question 1", "question 2"]
        }

        **If you have enough information to generate the app:**
        Return a JSON object with the format:
        {
            "status": "complete",
            "application": {
                "name": "A descriptive name for the app",
                "frontend": {
                    "html": "<!-- HTML code -->",
                    "css": "/* CSS code */",
                    "javascript": "// JavaScript code"
                },
                "backend": {
                    "server.js": "// A simple Node.js/Express server or a serverless function"
                }
            }
        }

        **Instructions:**
        1.  **Analyze the user's prompt:** ${prompt}
        2.  **Think step-by-step:** What features are needed? What is the data model? How should the UI look?
        3.  **Generate Unique Code:** Do NOT use templates. Generate original, creative code for each request.
        4.  **Frontend:** Create a single HTML file with embedded CSS and JavaScript for simplicity. It should be a complete, runnable file.
        5.  **Backend:** Create a simple, single-file Node.js/Express backend. It should handle basic API requests if needed by the frontend. If no backend is needed, return an empty string for "server.js".
        6.  **Ask Questions if Needed:** If the prompt is ambiguous, ask specific follow-up questions.

        Begin the generation process now.
    `;
}

/**
 * Simulates answering the AI's follow-up questions.
 */
function autoAnswerQuestions(questions) {
  const answers = questions.map((q) => ({
    question: q,
    answer: `(Auto-generated answer) Let's go with a standard approach for this.`,
  }));
  return { answers };
}

/**
 * Stores the generated code.
 */
async function storeGeneratedCode(sessionId, code) {
  console.log(`[Orchestrator] Storing code for session: ${sessionId}`);
  generatedCodeStore.set(sessionId, code);
  return true;
}

module.exports = {
  generateApplication,
};
