// vibeCodeSpace_clone/backend/src/routes/generate.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { generateApplication } = require("../lib/aiOrchestrator");
const { v4: uuidv4 } = require("uuid");
const { checkUsage } = require("../middleware/checkUsage");
const { supabase } = require("../lib/supabase/server"); // Import supabase client

const router = express.Router();

// Placeholder for JWT authentication middleware
const authenticateUser = (req, res, next) => {
  req.user = { id: "mock-user-id-123" }; // Replace with actual user logic
  next();
};

// Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Request Validation Middleware
const validateRequest = [
  body("prompt").notEmpty().withMessage("Prompt is required."),
];

// The API Endpoint with full freemium logic
router.post(
  "/generate-app",
  apiLimiter,
  authenticateUser,
  checkUsage,
  validateRequest,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt } = req.body;
    const sessionId = uuidv4();

    try {
      const generatedApp = await generateApplication(prompt, sessionId);

      // Atomically increment the user's generation count in the database
      const { error: incrementError } = await supabase.rpc(
        "increment_generations",
        { user_id: req.user.id },
      );
      if (incrementError) {
        // If this fails, we should ideally handle it, but for now, we'll log it.
        console.error(
          `Failed to increment usage for user ${req.user.id}:`,
          incrementError,
        );
      }

      res.status(200).json({
        message: "Application generated successfully!",
        sessionId: sessionId,
        application: generatedApp,
      });
    } catch (error) {
      console.error(`API Error for session ${sessionId}:`, error);
      res
        .status(500)
        .json({
          error: "An error occurred during the application generation process.",
        });
    }
  },
);

module.exports = router;
