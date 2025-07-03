const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth");
const generateRouter = require("./routes/generate");
const paymentsRouter = require("./routes/payments"); // Import the payments router

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

// Use express.json for all routes except the webhook
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// Mount the routers
app.use("/api/auth", authRouter);
app.use("/api", generateRouter);
app.use("/api/payments", paymentsRouter); // Mount the new payments router

app.get("/", (req, res) => {
  res.send("Hello from VibeCode Backend!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
