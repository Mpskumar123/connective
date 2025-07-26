const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth'); // For authentication
const uploadResume = require('../middleware/multerConfig'); // Import the Multer upload middleware

// Routes
// POST /api/v1/application/apply - Submit a new application with resume upload
router.post('/apply', authMiddleware, uploadResume.single('resume'), applicationController.submitApplication);

// GET /api/v1/application/me - Get applications submitted by the current applicant
router.get('/me', authMiddleware, applicationController.getMyApplications);

// GET /api/v1/application/job/:jobId - Get applications for a specific job (for recruiter/admin)
router.get('/job/:jobId', authMiddleware, applicationController.getApplicationsByJob);

// GET /api/v1/application/all - Get all applications (Admin only)
router.get('/all', authMiddleware, applicationController.getAllApplications);

// PATCH /api/v1/application/:applicationId/status - Update application status (for recruiter/admin)
router.patch('/:applicationId/status', authMiddleware, applicationController.updateApplicationStatus);

// GET /api/v1/application/resume/:applicationId - Download resume (for recruiter/admin)
router.get('/resume/:applicationId', authMiddleware, applicationController.downloadResume);

module.exports = router;