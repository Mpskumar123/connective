const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require('path');
const app = express();

// Load environment variables from the root .env file (backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Two levels up to backend/.env

// --- Environment Variable Checks for Profile Service ---
const requiredEnvVars = [
    'PROFILE_DB_URI', // New DB URI for Profile Service
    'JWT_SECRET',     // To verify tokens
    'NODE_ENV',
    'FRONTEND_URL'
    // Removed AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
];
console.log('✅ Profile Service Startup - PROFILE_DB_URI:', process.env.PROFILE_DB_URI ? 'Loaded' : 'MISSING!');
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Profile Service: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// --- Middlewares ---
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()) : [];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Profile Service: Not allowed by CORS - ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150, // Adjust rate limit as needed
    message: "Too many requests to Profile Service from this IP, please try again later."
});
app.use("/api/v1/profile/", limiter); // Apply rate limit specific to /api/v1/profile routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Serve static uploaded files locally ---
// IMPORTANT: This is for local development only. In production, these files should be served by Nginx or a dedicated static file server.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Routes Setup ---
const profileRoutes = require('./routes/profile');
app.use("/api/v1/profile", profileRoutes); // All profile routes will be prefixed with /api/v1/profile

// --- Health Check Endpoint ---
app.get("/health", (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        service: "ConnectYou Profile Service",
        status: "OK",
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    };
    res.json(status);
});

// --- MongoDB Connection for Profile Service ---
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.PROFILE_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log("✅ Profile Service: MongoDB Connected");
    } catch (err) {
        if (retries > 0) {
            console.error(`❌ Profile Service: MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error("❌ Profile Service: MongoDB Connection Error (max retries reached):", err.message);
            process.exit(1);
        }
    }
};

// --- Global Error Handler ---
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// --- Graceful Shutdown ---
const gracefulShutdown = async () => {
    console.log('🔄 Profile Service: Received shutdown signal');
    try {
        await mongoose.connection.close();
        console.log('📦 Profile Service: MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Profile Service: Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Profile Service: Unhandled Promise Rejection:', reason);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
process.on('uncaughtException', (err) => {
    console.error('❌ Profile Service: Uncaught Exception:', err);
    process.exit(1);
});

// --- Start Server ---
const PROFILE_SERVICE_PORT = process.env.PROFILE_SERVICE_PORT || 3002;
const server = app.listen(PROFILE_SERVICE_PORT, () => {
    console.log(`
🚀 Profile Service is running
📍 PORT: ${PROFILE_SERVICE_PORT}
🌍 ENV: ${process.env.NODE_ENV}
⏰ Time: ${new Date().toLocaleString()}
    `);
});

// --- Connect to MongoDB ---
connectDB();

module.exports = { app, server };