const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth'); // Import the auth router
const generateRouter = require('./routes/generate'); // Import the generate router

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Mount the routers
app.use('/api/auth', authRouter);
app.use('/api', generateRouter); // Mount the new generate router

app.get('/', (req, res) => {
  res.send('Hello from VibeCode Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
