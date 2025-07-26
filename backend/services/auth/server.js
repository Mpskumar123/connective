const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require('path'); // Used for resolving .env path
const app = express();

// Load environment variables from the root .env file


// ✅ Load .env from the same directory as server.js
require('dotenv').config();
// --- Environment Variable Checks for Auth Service ---
const requiredEnvVars = [
    'AUTH_DB_URI', // Dedicated MongoDB URI for Auth Service
    'JWT_SECRET',  // Secret for JWT token generation/verification
    'NODE_ENV',    // Environment (development, production)
    'FRONTEND_URL',// For CORS configuration
    'EMAIL_USER',  // For Nodemailer in password reset
    'EMAIL_PASS'   // For Nodemailer in password reset
];
console.log('✅ AUTH_DB_URI from .env:', process.env.AUTH_DB_URI);

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Auth Service: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1); // Exit if critical environment variables are not set
}

// --- Security and Logging Middleware ---
app.use(helmet()); // Sets various HTTP headers for security
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')); // Request logging

// --- CORS Configuration (Auth Service specific) ---
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()) : [];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman/curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Auth Service: Not allowed by CORS - ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // Specify allowed headers
    credentials: true // Allow cookies, authorization headers
}));

// --- Rate Limiting for API routes ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 200,                   // Limit each IP to 200 requests per windowMs for auth operations
    message: "Too many requests to Auth Service from this IP, please try again later."
});
app.use("/api/", limiter); // Apply to all routes under /api/ in this service

// --- Body Parsers ---
app.use(express.json({ limit: '5mb' })); // Parses JSON request bodies, limiting to 5MB
app.use(express.urlencoded({ extended: true, limit: '5mb' })); // Parses URL-encoded bodies

// --- Custom Request Logging Middleware (if copied to local middleware) ---
// If you moved `requestLogger.js` to `services/auth-service/middleware/`
// const requestLogger = require('./middleware/requestLogger');
// app.use(requestLogger);

// --- Routes Setup ---
// Only include authentication-related routes
const authRoutes = require('./routes/auth'); // This file contains register, login, password reset etc.
app.use("/api/v1/auth", authRoutes); // All auth routes will be prefixed with /api/v1/auth

// --- Health Check Endpoint ---
app.get("/health", (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        service: "ConnectYou Auth Service",
        status: "OK",
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    };
    res.json(status);
});

// --- MongoDB Connection for Auth Service ---
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.AUTH_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s for initial connection
            socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
        });
        console.log("✅ Auth Service: MongoDB Connected");
    } catch (err) {
        if (retries > 0) {
            console.error(`❌ Auth Service: MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000); // Retry after 5 seconds
        } else {
            console.error("❌ Auth Service: MongoDB Connection Error (max retries reached):", err.message);
            process.exit(1); // Exit process if connection fails after retries
        }
    }
};

// --- Global Error Handler (for Auth Service) ---
// Ensure `services/auth-service/middleware/errorHandler.js` exists and handles errors gracefully
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// --- Graceful Shutdown Handling ---
const gracefulShutdown = async () => {
    console.log('🔄 Auth Service: Received shutdown signal');
    try {
        await mongoose.connection.close();
        console.log('📦 Auth Service: MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Auth Service: Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown); // For Docker/Kubernetes shutdown signals
process.on('SIGINT', gracefulShutdown);  // For Ctrl+C
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Auth Service: Unhandled Promise Rejection:', reason);
    // Log this to your monitoring system
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1); // Exit in non-production for easier debugging
    }
});
process.on('uncaughtException', (err) => {
    console.error('❌ Auth Service: Uncaught Exception:', err);
    // Log this to your monitoring system
    process.exit(1); // Critical: Exit for uncaught exceptions
});


// --- Start Server ---
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3001; // Default port for Auth Service
const server = app.listen(AUTH_SERVICE_PORT, () => {
    console.log(`
🚀 Auth Service is running
📍 PORT: ${AUTH_SERVICE_PORT}
🌍 ENV: ${process.env.NODE_ENV}
⏰ Time: ${new Date().toLocaleString()}
    `);
});

// --- Connect to MongoDB ---
connectDB();

module.exports = { app, server };
