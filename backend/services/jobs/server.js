const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require('path');
const app = express();

// Load environment variables from the root .env file.
// This path is crucial for a mono-repo setup where .env is at the project root.
require('dotenv').config();

// --- Environment Variable Checks for job
//  Service ---
const requiredEnvVars = [
    'AUTH_DB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'FRONTEND_URL',
    'EMAIL_USER',
    'EMAIL_PASS'
];
console.log('✅ job Service Startup - AUTH_DB_URI:', process.env.AUTH_DB_URI ? 'Loaded' : 'MISSING!'); // Improved log
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ job Service: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// --- Security and Logging Middleware ---
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// --- CORS Configuration (job Service specific) ---
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()) : [];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`job Service: Not allowed by CORS - ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true
}));

// --- Rate Limiting for API routes ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests to job Service from this IP, please try again later."
});
app.use("/api/v1/job/", limiter); // Apply rate limiting specifically to /api/v1/job routes

// --- Body Parsers ---
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// --- Routes Setup ---
const jobRoutes = require('./routes/jobs');
app.use("/api/v1/job", jobRoutes); // All job routes will be prefixed with /api/v1/job

// --- Health Check Endpoint ---
app.get("/health", (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        service: "ConnectYou job Service",
        status: "OK",
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    };
    res.json(status);
});

// --- MongoDB Connection for job Service ---
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.AUTH_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log("✅ job Service: MongoDB Connected");
    } catch (err) {
        if (retries > 0) {
            console.error(`❌ job Service: MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error("❌ job Service: MongoDB Connection Error (max retries reached):", err.message);
            process.exit(1);
        }
    }
};

// --- Global Error Handler (for job Service) ---
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// --- Graceful Shutdown Handling ---
const gracefulShutdown = async () => {
    console.log('🔄 job Service: Received shutdown signal');
    try {
        await mongoose.connection.close();
        console.log('📦 job Service: MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ job Service: Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ job Service: Unhandled Promise Rejection:', reason);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
process.on('uncaughtException', (err) => {
    console.error('❌ job Service: Uncaught Exception:', err);
    process.exit(1);
});

// --- Start Server ---
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3001;
const server = app.listen(AUTH_SERVICE_PORT, () => {
    console.log(`
🚀 job Service is running
📍 PORT: ${AUTH_SERVICE_PORT}
🌍 ENV: ${process.env.NODE_ENV}
⏰ Time: ${new Date().toLocaleString()}
    `);
});

// --- Connect to MongoDB ---
connectDB();

module.exports = { app, server };