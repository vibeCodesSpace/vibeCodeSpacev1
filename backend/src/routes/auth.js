// vibeCodeSpace_clone/backend/src/routes/auth.js
const express = require("express");
const { supabase } = require("../lib/supabase/server"); // Using the existing Supabase client

const router = express.Router();

// 1. Sign-up with email and password
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  // Supabase sends a confirmation email. The user is not signed in yet.
  res.status(200).json({
    message: "Sign-up successful. Please check your email to confirm.",
    user: data.user,
  });
});

// 2. Sign-in with email and password
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ session: data.session, user: data.user });
});

// 3. Social Login (OAuth) - Initiates the flow
router.get("/signin/:provider", async (req, res) => {
  const { provider } = req.params;
  if (!["google", "github"].includes(provider)) {
    return res.status(400).json({ error: "Invalid provider." });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: "http://localhost:3000/auth/callback", // Your frontend callback URL
    },
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  // The URL to which the user should be redirected to start the OAuth flow.
  res.status(200).json({ url: data.url });
});

// 4. Password Reset Request (sends an email)
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/update-password", // URL to your frontend password update page
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ message: "Password reset email sent." });
});

// 5. Sign Out
router.post("/signout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: "Signed out successfully." });
});

// 6. Get User Session
// This route demonstrates how to get user data if a valid JWT is provided.
router.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header provided." });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json(user);
});

module.exports = router;
