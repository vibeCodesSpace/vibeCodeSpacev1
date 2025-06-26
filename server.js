const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const slackWebhook = process.env.SLACK_WEBHOOK_URL;
const openaiKey = process.env.OPENAI_API_KEY;

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, "dist")));

// For all GET requests, send back index.html so React Router works
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

services:
  - type: web
    name: vibeCodeSpace
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: node server.js
    envVars:
      - key: NODE_VERSION
        value: 20
