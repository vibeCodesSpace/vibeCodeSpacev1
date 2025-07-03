// generated_app/backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Using axios for making HTTP requests

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// This is the secure proxy endpoint.
// The frontend will call this instead of the real external API.
app.post('/api/proxied-request', async (req, res) => {
  try {
    // The secret API key is only ever on the server.
    const secretApiKey = process.env.SOME_SECRET_API_KEY;
    const externalApiUrl = 'https://api.example.com/data';

    // The backend makes the request to the external API, adding the secret key.
    const response = await axios.post(externalApiUrl, req.body, {
      headers: {
        'Authorization': `Bearer ${secretApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // The backend sends the response from the external API back to the frontend.
    // The secret key is never exposed.
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in proxied request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Generated app backend listening at http://localhost:${port}`);
});
