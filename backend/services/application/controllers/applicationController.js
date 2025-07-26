const Application = require('../models/Application');
const axios = require('axios'); // For inter-service communication
const mongoose = require('mongoose'); // For ObjectId validation
const fs = require('fs'); // For deleting local files
const path = require('path'); // For path operations

// --- Service URLs (Get from environment variables) ---
const JOBS_SERVICE_URL = process.env.JOBS_SERVICE_URL;     // e.g., http://monolith-backend:9000 (for now)
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL; // e.g., http://profile-service:3002

/**
 * @desc Submit a new job application
 * @route POST /api/v1/application/apply
 * @access Private (Applicant)
 */
exports.submitApplication = async (req, res, next) => {
    let uploadedFilePath = null; // To track file path for cleanup on error
    try {
        const { jobId, coverLetter } = req.body;
        const applicantId = req.user.id; // From authMiddleware (authenticated user)

        // Multer puts file info on req.file
        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required.' });
        }
        uploadedFilePath = req.file.path; // Store path for cleanup
        const resumePath = `/uploads/resumes/${path.basename(req.file.path)}`; // Path to store in DB
        const resumeOriginalName = req.file.originalname;

        // 1. Basic Validation
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            // Delete uploaded file if validation fails here
            if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
            return res.status(400).json({ message: 'Valid Job ID is required.' });
        }

        // 2. Check if already applied (using applicantId from token)
        const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
        if (existingApplication) {
            if (uploadedFilePath) fs.unlinkSync(uploadedFilePath); // Delete uploaded file
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }

        let jobDetails = null;
        let recruiterId = null;
        // 3. Verify Job Existence and Get Recruiter ID (Jobs Service Interaction)
        // IMPORTANT: JOBS_SERVICE_URL must point to where job details can be fetched (monolith or new Jobs service)
        try {
            const jobResponse = await axios.get(`${JOBS_SERVICE_URL}/api/jobs/${jobId}`); // Adjust path based on monolith/Jobs service
            jobDetails = jobResponse.data;

            if (!jobDetails || jobDetails.status === 'Closed') { // Assuming job status exists
                if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
                return res.status(400).json({ message: 'Job is not found or no longer open.' });
            }
            recruiterId = jobDetails.postedBy || jobDetails.recruiterId; // Assuming job has a 'postedBy' or 'recruiterId' field
            if (!recruiterId) {
                if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
                return res.status(500).json({ message: 'Job missing recruiter information.' });
            }

        } catch (jobError) {
            if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
            console.error(`Application Service: Failed to verify job ${jobId} with Jobs Service:`, jobError.message);
            // Translate common axios errors to client-friendly messages
            if (jobError.response?.status === 404) {
                return res.status(404).json({ message: 'Job not found.' });
            }
            return res.status(500).json({ message: 'Could not connect to Jobs Service or verify job details.' });
        }

        // 4. Fetch Applicant's Profile Snapshot (Profile Service Interaction)
        let applicantProfileSnapshot = {};
        try {
            const profileResponse = await axios.get(`${PROFILE_SERVICE_URL}/api/v1/profile/me`, {
                headers: { 'Authorization': req.header('Authorization') } // Forward the token
            });
            const profileData = profileResponse.data;

            // Take a snapshot of essential applicant profile data
            applicantProfileSnapshot = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                phone: profileData.phone,
                headline: profileData.headline,
                skills: profileData.skills
            };

        } catch (profileError) {
            if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
            console.error(`Application Service: Failed to fetch profile snapshot for applicant ${applicantId}:`, profileError.message);
            return res.status(500).json({ message: 'Could not retrieve applicant profile data from Profile Service.' });
        }

        // 5. Create Application
        const application = new Application({
            job: jobId,
            jobSnapshot: {
                title: jobDetails.title,
                companyName: jobDetails.company || jobDetails.companyName, // Adjust field names based on Job model
                location: jobDetails.location,
                type: jobDetails.type
            },
            applicant: applicantId,
            applicantSnapshot: applicantProfileSnapshot,
            recruiter: recruiterId, // Assign recruiter based on job details
            resumePath: resumePath,
            resumeOriginalName: resumeOriginalName,
            coverLetter: coverLetter
        });

        await application.save();

        // TODO: Publish an event to Notification Service: 'ApplicationSubmittedEvent'
        // This would happen asynchronously via a Message Broker (Kafka/RabbitMQ)

        res.status(201).json({ message: 'Application submitted successfully.', application });

    } catch (error) {
        // Delete uploaded file if there's an error during the process
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        console.error('🔥 Application Service: Apply for job error:', error);
        next(error); // Pass to global error handler
    }
};

/**
 * @desc Get applications for a specific job (for recruiter/admin)
 * @route GET /api/v1/application/job/:jobId
 * @access Private (Recruiter/Admin)
 */
exports.getApplicationsByJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user.id; // Authenticated recruiter/admin ID

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID format.' });
        }

        // IMPORTANT: Verify recruiter's permission to view applications for this job
        // This requires an API call to Jobs Service to confirm ownership:
        // try {
        //     const jobResponse = await axios.get(`${JOBS_SERVICE_URL}/api/v1/jobs/${jobId}/recruiter-auth`, {
        //         headers: { 'X-User-ID': recruiterId, 'Authorization': req.header('Authorization') }
        //     });
        //     if (jobResponse.status !== 200) { /* handle unauthorized access */ }
        // } catch (authError) {
        //     return res.status(403).json({ message: 'Not authorized to view applications for this job.' });
        // }


        const { page = 1, limit = 10, status } = req.query;

        const query = { job: mongoose.Types.ObjectId(jobId), recruiter: mongoose.Types.ObjectId(recruiterId) }; // Filter by job and recruiter
        if (req.user.role === 'admin') { // Admin can see all applications for a job
            delete query.recruiter;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        // NOTE: No populate('jobId') here, as Job is in another service.
        // Frontend will need to fetch job details separately if needed.
        const applications = await Application.find(query)
            .sort({ appliedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Application.countDocuments(query);

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error('🔥 Application Service: Get applications by job error:', error);
        next(error);
    }
};

/**
 * @desc Get all applications (for admin/overview)
 * @route GET /api/v1/application/all
 * @access Private (Admin)
 */
exports.getAllApplications = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') { // Only admin can get all applications
            return res.status(403).json({ message: 'Forbidden: Only administrators can access all applications.' });
        }

        const { page = 1, limit = 20 } = req.query;

        // NOTE: No populate('jobId') here. Frontend to compose data.
        const applications = await Application.find()
            .sort({ appliedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Application.countDocuments();

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error('🔥 Application Service: Get all applications error:', error);
        next(error);
    }
};

/**
 * @desc Get applications by a specific applicant
 * @route GET /api/v1/application/me
 * @access Private (Applicant)
 */
exports.getMyApplications = async (req, res, next) => {
    try {
        const applicantId = req.user.id; // Authenticated applicant ID

        const applications = await Application.find({ applicant: applicantId });

        res.status(200).json(applications);
    } catch (error) {
        console.error('🔥 Application Service: Get my applications error:', error);
        next(error);
    }
};

/**
 * @desc Update application status
 * @route PUT /api/v1/application/:applicationId/status
 * @access Private (Recruiter/Admin)
 */
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const recruiterId = req.user.id; // Authenticated recruiter/admin ID

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: 'Invalid Application ID format.' });
        }
        const validStatuses = ['Applied', 'Reviewed', 'Interview Scheduled', 'Interviewed', 'Offer Extended', 'Accepted', 'Rejected', 'Withdrawn'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid application status.' });
        }

        // Find application and ensure recruiter has permission to update it
        // Only the recruiter who posted the job (or admin) should update status
        const application = await Application.findOne({ _id: applicationId });

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // Authorization check: Only the recruiter who posted the job or an admin can update
        if (application.recruiter.toString() !== recruiterId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to update this application status.' });
        }

        application.status = status;
        await application.save();

        // TODO: Publish an event to Notification Service: 'ApplicationStatusChangedEvent'

        res.status(200).json({ message: 'Application status updated successfully.', application });

    } catch (error) {
        console.error('🔥 Application Service: Update application status error:', error);
        next(error);
    }
};

/**
 * @desc Download resume
 * @route GET /api/v1/application/resume/:applicationId
 * @access Private (Recruiter/Admin)
 */
exports.downloadResume = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user.id; // Authenticated user ID (recruiter/admin)

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: 'Invalid Application ID format.' });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // Authorization Check: Only the recruiter who posted the job or an admin can download
        if (application.recruiter.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to download this resume.' });
        }

        const resumeFilePath = path.resolve(application.resumePath); // Path should be relative to the container's root or absolute
        
        // Ensure path is within the designated uploads directory for security
        const uploadsBaseDir = path.resolve(__dirname, '../uploads');
        if (!resumeFilePath.startsWith(uploadsBaseDir)) {
            console.warn(`Attempted to access file outside uploads directory: ${resumeFilePath}`);
            return res.status(403).json({ message: 'Forbidden: Invalid file path.' });
        }

        if (!fs.existsSync(resumeFilePath)) {
            return res.status(404).json({ message: 'Resume file not found on server.' });
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${application.resumeOriginalName}"`);
        res.setHeader('Content-Type', 'application/octet-stream'); // Generic binary file type

        // Stream the file
        const fileStream = fs.createReadStream(resumeFilePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('🔥 Application Service: Error downloading resume:', error);
        next(error);
    }
};