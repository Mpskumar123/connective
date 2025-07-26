const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require('path'); // <--- CRITICAL FIX: ENSURE THIS LINE IS AT THE TOP
const app = express();

// --- ADD THESE DEBUGGING LINES ---
console.log('DEBUG [1]: __dirname is:', __dirname);
const calculatedEnvPath = path.resolve(__dirname, '../../.env'); // Correct path: two levels up to backend/.env
console.log('DEBUG [2]: Calculated .env path is:', calculatedEnvPath);
// --- END DEBUGGING LINES ---

// Load environment variables from the root .env file (backend/.env)
dotenv.config({ path: calculatedEnvPath }); // Use the calculated path

// --- ADD THESE DEBUGGING LINES ---
console.log('DEBUG [3]: process.env.APPLICATION_DB_URI after dotenv.config:', process.env.APPLICATION_DB_URI);
console.log('DEBUG [4]: process.env.JWT_SECRET after dotenv.config:', process.env.JWT_SECRET);
console.log('DEBUG [5]: process.env.NODE_ENV after dotenv.config:', process.env.NODE_ENV);
console.log('DEBUG [6]: process.env.FRONTEND_URL after dotenv.config:', process.env.FRONTEND_URL);
console.log('DEBUG [7]: process.env.JOBS_SERVICE_URL after dotenv.config:', process.env.JOBS_SERVICE_URL);
console.log('DEBUG [8]: process.env.PROFILE_SERVICE_URL after dotenv.config:', process.env.PROFILE_SERVICE_URL);
// --- END DEBUGGING LINES ---


// --- Environment Variable Checks for Application Service ---
const requiredEnvVars = [
    'APPLICATION_DB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'FRONTEND_URL',
    'JOBS_SERVICE_URL',
    'PROFILE_SERVICE_URL'
];
console.log('✅ Application Service Startup - APPLICATION_DB_URI:', process.env.APPLICATION_DB_URI ? 'Loaded' : 'MISSING!');
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Application Service: Missing required environment variables: ${missingEnvVars.join(', ')}`);
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
            callback(new Error(`Application Service: Not allowed by CORS - ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Adjust rate limit as needed
    message: "Too many requests to Application Service from this IP, please try again later."
});
app.use("/api/v1/application/", limiter);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// --- Serve static uploaded files locally ---
// IMPORTANT: This is for local development only. In production, these files should be served by Nginx or a dedicated static file server.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Routes Setup ---
const applicationRoutes = require('./routes/application');
app.use("/api/v1/application", applicationRoutes);

// --- Health Check Endpoint ---
app.get("/health", (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        service: "ConnectYou Application Service",
        status: "OK",
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    };
    res.json(status);
});

// --- MongoDB Connection for Application Service ---
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.APPLICATION_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log("✅ Application Service: MongoDB Connected");
    } catch (err) {
        if (retries > 0) {
            console.error(`❌ Application Service: MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error("❌ Application Service: MongoDB Connection Error (max retries reached):", err.message);
            process.exit(1);
        }
    }
};

// --- Global Error Handler ---
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// --- Graceful Shutdown ---
const gracefulShutdown = async () => {
    console.log('🔄 Application Service: Received shutdown signal');
    try {
        await mongoose.connection.close();
        console.log('📦 Application Service: MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Application Service: Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Application Service: Unhandled Promise Rejection:', reason);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
process.on('uncaughtException', (err) => {
    console.error('❌ Application Service: Uncaught Exception:', err);
    process.exit(1);
});

// --- Start Server ---
const APPLICATION_SERVICE_PORT = process.env.APPLICATION_SERVICE_PORT || 3003;
const server = app.listen(APPLICATION_SERVICE_PORT, () => {
    console.log(`
🚀 Application Service is running
📍 PORT: ${APPLICATION_SERVICE_PORT}
🌍 ENV: ${process.env.NODE_ENV}
⏰ Time: ${new Date().toLocaleString()}
    `);
});

// --- Connect to MongoDB ---
connectDB();

module.exports = { app, server };