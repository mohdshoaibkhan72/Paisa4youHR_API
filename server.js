require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./configs/db-config");
const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin-route");
const employeeRoute = require("./routes/employee-route");
const leaderRoute = require("./routes/leader-route");
const errorMiddleware = require("./middlewares/error-middleware");
const ErrorHandler = require("./utils/error-handler");
const { auth, authRole } = require("./middlewares/auth-middleware");

const PORT = process.env.PORT || 5500;
const { CLIENT_URL } = process.env;

// Fix Mongoose Deprecation Warning
mongoose.set("strictQuery", false);

// Initialize Express App
const app = express();

// Database Connection
dbConnection();

// CORS Configuration
const corsOption = {
  credentials: true, // Allow sending cookies
  origin: (origin, callback) => {
    const whitelist = [
      "http://localhost:3000",
      "http://192.168.1.101:3000",
      CLIENT_URL,
    ];

    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow request
    } else {
      callback(new Error("Not allowed by CORS")); // Block request
    }
  },
};

app.use(cors(corsOption)); // Use the CORS middleware with your config

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Allow cookie parsing

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", auth, authRole(["admin"]), adminRoute);
app.use("/api/employee", auth, authRole(["employee", "leader"]), employeeRoute);
app.use("/api/leader", auth, authRole(["leader"]), leaderRoute);
app.use("/storage", express.static("storage")); // Serve static files

// Error Handling for Unmatched Routes
app.use((req, res, next) => {
  return next(ErrorHandler.notFound("The Requested Resource Not Found"));
});

app.use(errorMiddleware); // Custom error handling middleware

// Test Root Route
app.get("/shoiab", (req, res) => {
  res.json("OK");
});

// Start the Server
app.listen(PORT, () => console.log(`Listening On Port : ${PORT}`));
