// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";

// Sample Route
app.get("/sample", (req, res) => {
  res.json({ message: "API is working!" });
});

// Register your routes here — clean and simple
app.use("/api/auth", authRoutes);

// Start Server Only After Successful DB Connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 5000;

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Run it
startServer();