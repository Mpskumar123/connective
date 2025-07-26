const express = require('express');
const authController = require('../controllers/authController'); // Import the controller functions
const authMiddleware = require('../middleware/auth'); // Import the authentication middleware

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser); // Correctly defined as POST
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);

// Authenticated user routes (require a valid JWT token)
router.get('/profile', authMiddleware, authController.getAuthUserProfile); // Gets basic user info from Auth Service

// --- IMPORTANT: Removed Course Enrollment/Progress Routes ---
// These routes were:
// router.post('/enroll/:courseId', auth, async (req, res) => { ... });
// router.post('/courses/:courseId/lessons/:lessonId/complete', auth, async (req, res) => { ... });
// They have been removed as they represent separate business capabilities
// and should be handled by a distinct service (e.g., a Courses/Enrollment Service).

module.exports = router;