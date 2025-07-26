const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth'); // Corrected path for middleware

const router = express.Router();

// Authenticated routes (require a valid JWT token)
// GET /api/v1/profile/me - Get current user's own profile
router.get('/me', authMiddleware, profileController.getMyProfile);

// POST/PUT /api/v1/profile - Create or update current user's profile
router.post('/', authMiddleware, profileController.createOrUpdateProfile); // For initial creation
router.put('/', authMiddleware, profileController.createOrUpdateProfile); // For updating

// PUT /api/v1/profile/avatar - Upload/update profile picture
router.put('/avatar', authMiddleware, profileController.uploadAvatar); // Multer middleware is within controller function

// DELETE /api/v1/profile - Delete current user's profile
router.delete('/', authMiddleware, profileController.deleteMyProfile);

// Public route (or restricted by authorization for specific roles)
// GET /api/v1/profile/:userId - Get profile by any user ID
router.get('/:userId', profileController.getProfileByUserId);

module.exports = router;