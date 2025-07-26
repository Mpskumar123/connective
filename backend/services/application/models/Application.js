const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { // Reference to the Job ID (from Jobs Service)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Conceptual link, Application Service does NOT populate Job model
        required: true
    },
    jobSnapshot: { // Snapshot of key job details at time of application
        title: { type: String, required: true },
        companyName: { type: String, required: true },
        location: String,
        type: String // e.g., Full-time, Internship
    },
    applicant: { // Reference to the User ID (from Auth Service)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Conceptual link, Application Service does NOT populate User model
        required: true
    },
    applicantSnapshot: { // Snapshot of key applicant details at time of application
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        headline: { type: String }, // from Profile Service
        skills: [{ type: String }]  // from Profile Service
    },
    recruiter: { // Reference to the User ID (from Auth Service) who posted the job
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Reviewed', 'Interview Scheduled', 'Interviewed', 'Offer Extended', 'Accepted', 'Rejected', 'Withdrawn'],
        default: 'Applied'
    },
    resumePath: { // Local path to resume file for now. Later: Cloud Storage URL
        type: String,
        required: true
    },
    resumeOriginalName: { // Original file name for download
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries and uniqueness
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // One application per user per job
applicationSchema.index({ applicant: 1, appliedAt: -1 }); // For getting applicant's applications
applicationSchema.index({ job: 1, status: 1 }); // For getting job applications by status

module.exports = mongoose.model('Application', applicationSchema);