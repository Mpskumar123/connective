const express = require('express');
const router = express.Router();
const { getJobs , postJob , deleteJob , updateJob}  = require('../controllers/jobsController');
const authMiddleware = require('../middleware/auth'); // Corrected path for middleware


router.get('/',authMiddleware, getJobs);
router.post('/',authMiddleware, postJob);
router.delete('/:id',authMiddleware, deleteJob);
router.put('/:id',authMiddleware, updateJob);

module.exports = router;
