const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: { // Link to the user ID from Auth Service
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Conceptual link, Profile Service does NOT populate Auth Service's User model
        required: true,
        unique: true // One profile per user
    },
    bio: { type: String, trim: true, maxlength: 500, default: "Tell us about yourself" },
    headline: { type: String, trim: true, maxlength: 100 },
    avatarUrl: { type: String }, // URL to profile picture (now local path or served by another service)
    location: { type: String, default: "Not specified" },

    skills: {
        type: [String],
        required: true
    },

    education: [
        {
            school: { type: String, required: true, trim: true },
            degree: { type: String, required: true, trim: true },
            fieldofstudy: { type: String, required: true, trim: true },
            from: { type: Date, required: true },
            to: { type: Date },
            current: { type: Boolean, default: false },
            description: { type: String, trim: true }
        }
    ],

    experience: [
        {
            title: { type: String, required: true, trim: true },
            company: { type: String, required: true, trim: true },
            location: { type: String, trim: true },
            from: { type: Date, required: true },
            to: { type: Date },
            current: { type: Boolean, default: false },
            description: { type: String, trim: true }
        }
    ],

    university: { type: String, trim: true },
    branch: { type: String, enum: ["Computer Science", "Information Technology", "Mechanical", "Electrical", "Civil", null, ""] },
    yearOfStudy: { type: String, enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", null, ""] },
    regno: { type: String, trim: true },

    graduationYear: { type: String },
    currentCompany: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    industry: { type: String, trim: true },

    socialLinks: {
        linkedin: { type: String, trim: true },
        github: { type: String, trim: true },
        twitter: { type: String, trim: true },
        website: { type: String, trim: true }
    },
    portfolioUrl: { type: String, trim: true },

    resumeUrl: { type: String }, // URL to resume (now local path or served by another service)
    isMentor: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

profileSchema.index({ user: 1 });

module.exports = mongoose.model('Profile', profileSchema);