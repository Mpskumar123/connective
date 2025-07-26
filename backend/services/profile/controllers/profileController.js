const Profile = require("../models/Profile");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Node.js File System module for local file handling
const { v4: uuidv4 } = require('uuid');

// --- Multer Configuration for Local Disk Storage ---
const UPLOADS_DIR = path.join(__dirname, '../uploads/avatars'); // Directory for avatars
// Ensure the upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR); // Save files to the local uploads directory
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + uuidv4();
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'), false);
    }
});

/**
 * @desc Get current user's profile
 * @route GET /api/v1/profile/me
 * @access Private
 */
exports.getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let profile = await Profile.findOne({ user: userId });

        if (!profile) {
            profile = new Profile({
                user: userId,
                skills: [],
            });
            await profile.save();
            return res.status(201).json({ message: "Initial profile created", profile });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error("🔥 Profile Service: Get My Profile error:", error.message);
        next(error);
    }
};

/**
 * @desc Get profile by user ID (for public viewing or admin)
 * @route GET /api/v1/profile/:userId
 * @access Public (or Private depending on requirements)
 */
exports.getProfileByUserId = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }
        const profile = await Profile.findOne({ user: req.params.userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found for this user.' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('🔥 Profile Service: Get Profile by User ID error:', error.message);
        next(error);
    }
};

/**
 * @desc Create or update user profile
 * @route POST /api/v1/profile (create)
 * @route PUT /api/v1/profile (update)
 * @access Private
 */
exports.createOrUpdateProfile = async (req, res, next) => {
    const userId = req.user.id;
    const {
        bio, headline, location, skills,
        university, branch, yearOfStudy, regno,
        graduationYear, currentCompany, jobTitle, industry,
        linkedin, github, twitter, website, portfolioUrl,
        experience, education,
        isMentor
    } = req.body;

    const profileFields = {};
    profileFields.user = userId;

    if (bio) profileFields.bio = bio;
    if (headline) profileFields.headline = headline;
    if (location) profileFields.location = location;

    if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());

    if (university) profileFields.university = university;
    if (branch) profileFields.branch = branch;
    if (yearOfStudy) profileFields.yearOfStudy = yearOfStudy;
    if (regno) profileFields.regno = regno;

    if (graduationYear) profileFields.graduationYear = graduationYear;
    if (currentCompany) profileFields.currentCompany = currentCompany;
    if (jobTitle) profileFields.jobTitle = jobTitle;
    if (industry) profileFields.industry = industry;

    profileFields.socialLinks = {};
    if (linkedin) profileFields.socialLinks.linkedin = linkedin;
    if (github) profileFields.socialLinks.github = github;
    if (twitter) profileFields.socialLinks.twitter = twitter;
    if (website) profileFields.socialLinks.website = website;

    if (portfolioUrl) profileFields.portfolioUrl = portfolioUrl;
    if (typeof isMentor !== 'undefined') profileFields.isMentor = isMentor;

    if (experience && Array.isArray(experience)) profileFields.experience = experience;
    if (education && Array.isArray(education)) profileFields.education = education;

    try {
        let profile = await Profile.findOne({ user: userId });

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: userId },
                { $set: profileFields },
                { new: true, runValidators: true }
            );
            return res.status(200).json(profile);
        } else {
            profile = new Profile(profileFields);
            await profile.save();
            return res.status(201).json(profile);
        }
    } catch (error) {
        console.error('🔥 Profile Service: Create/Update Profile error:', error.message);
        next(error);
    }
};

/**
 * @desc Handle profile picture upload
 * @route PUT /api/v1/profile/avatar
 * @access Private
 */
exports.uploadAvatar = [
    upload.single('avatar'), // Multer middleware to handle single file upload named 'avatar'
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            // Construct local URL path for the avatar
            // Assuming your API Gateway or a static server exposes /uploads
            // Example: http://localhost:80/uploads/avatars/filename.jpg
            const avatarUrl = `/uploads/avatars/${req.file.filename}`;

            // Update profile with the new avatar URL
            const profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: { avatarUrl: avatarUrl } },
                { new: true, runValidators: true, upsert: true }
            );

            res.status(200).json({ message: 'Profile picture uploaded successfully', avatarUrl: avatarUrl, profile });

        } catch (error) {
            console.error('🔥 Profile Service: Avatar upload error:', error);
            next(error);
        }
    }
];

/**
 * @desc Delete profile
 * @route DELETE /api/v1/profile
 * @access Private
 */
exports.deleteMyProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOneAndDelete({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found to delete.' });
        }

        // OPTIONAL: Delete the local file if it exists
        if (profile.avatarUrl) {
            const filePath = path.join(UPLOADS_DIR, path.basename(profile.avatarUrl)); // Get filename from URL
            fs.unlink(filePath, (err) => {
                if (err) console.warn(`Profile Service: Failed to delete local avatar file: ${filePath}, Error: ${err.message}`);
                else console.log(`Profile Service: Deleted local avatar file: ${filePath}`);
            });
        }

        res.status(200).json({ message: 'Profile deleted successfully.' });

    } catch (error) {
        console.error('🔥 Profile Service: Delete Profile error:', error);
        next(error);
    }
};