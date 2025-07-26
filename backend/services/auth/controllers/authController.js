const { User, Student, Alumni } = require('../models/User');
const Mentor = require('../models/Mentor'); // Will be decoupled later via events
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer (ensure EMAIL_USER and EMAIL_PASS are in your root .env)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // Default to gmail, but use specific if set
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * @desc Register a new user (student or alumni)
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.registerUser = async (req, res, next) => {
    try {
        let {
            firstName, lastName, email, password, phone, userType,
            university, branch, yearOfStudy, studentId,
            currentCompany, jobTitle, industry, graduationYear
        } = req.body;

        // --- Input Sanitization & Validation ---
        firstName = validator.escape(firstName?.trim());
        lastName = validator.escape(lastName?.trim());
        email = validator.normalizeEmail(email?.trim());
        phone = phone?.trim();

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (phone && !validator.isMobilePhone(phone, 'en-IN')) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }
        // Password is always required and must be strong for non-social registration
        if (!password || !validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Validate userType
        if (!['student', 'alumni'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid userType. Must be student or alumni.' });
        }

        // Prepare user data based on userType
        const userData = {
            firstName, lastName, email, password, phone, userType,
            role: userType === 'student' ? 'student' : 'instructor' // Default role
        };

        let user;
        if (userType === 'student') {
            if (!university || !branch || !yearOfStudy || !studentId) {
                return res.status(400).json({ message: 'Missing required student fields: university, branch, yearOfStudy, studentId.' });
            }
            user = new Student({
                ...userData,
                university: validator.escape(university.trim()),
                branch,
                yearOfStudy,
                regno: validator.escape(studentId.trim())
            });
        } else if (userType === 'alumni') {
            if (!graduationYear || !currentCompany || !jobTitle || !industry) {
                return res.status(400).json({ message: 'Missing required alumni fields: graduationYear, currentCompany, jobTitle, industry.' });
            }
            user = new Alumni({
                ...userData,
                graduationYear,
                currentCompany: validator.escape(currentCompany.trim()),
                jobTitle: validator.escape(jobTitle.trim()),
                industry: validator.escape(industry.trim())
            });
        }

        await user.save();

        // --- Create Mentor Record if Alumni (Coupling to be addressed) ---
        if (userType === 'alumni') {
            try {
                const mentorData = {
                    _id: user._id,
                    name: `${firstName} ${lastName}`,
                    role: jobTitle,
                    company: currentCompany,
                    expertise: [industry],
                };
                const mentor = new Mentor(mentorData);
                await mentor.save();
                console.log(`Auth Service: Mentor record created for new alumni: ${user.email}`);
            } catch (mentorCreationError) {
                console.error("Auth Service: Error creating mentor record after alumni registration (consider decoupling via events):", mentorCreationError.message);
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully.',
            token,
            user: {
                id: user._id,
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error('🔥 Auth Service: Registration error:', error);
        next(error); // Pass error to global error handler
    }
};

/**
 * @desc Authenticate user & get token
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body; // Removed socialProvider, socialId

        // --- Traditional Email/Password Login Logic ---
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter both email and password' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email: validator.normalizeEmail(email.trim()) }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); // Generic message for security
        }

        // Check if user has a password (to avoid issues if a record without password somehow exists)
        if (!user.password) {
            // This user might be from a legacy social login without password, or data corruption
            return res.status(400).json({ message: "Invalid credentials: No password found for this user." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const redirectUrl = user.userType === "student" ? "/dashboard" : "/alumni";

        return res.json({
            token,
            redirectUrl,
            user: {
                id: user._id,
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                userType: user.userType,
            }
        });

    } catch (error) {
        console.error('🔥 Auth Service: Login error:', error);
        next(error);
    }
};

/**
 * @desc Get authenticated user's basic profile info
 * @route GET /api/v1/auth/profile
 * @access Private
 */
exports.getAuthUserProfile = async (req, res, next) => {
    try {
        // req.user.id is set by the authenticateUser middleware
        // Removed -firebaseUID from select as it's no longer a field
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return only basic user info owned by Auth Service
        res.json({
            id: user._id,
            user_id: user.user_id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            userType: user.userType,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    } catch (error) {
        console.error('🔥 Auth Service: Get User Profile error:', error);
        next(error);
    }
};

/**
 * @desc Request password reset
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email.trim())) {
            return res.status(400).json({ message: 'Valid email is required.' });
        }

        const normalizedEmail = validator.normalizeEmail(email.trim());
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${user.firstName},</p>
                <p>You requested a password reset for your account. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}"
                        style="background-color: #007bff; color: white; padding: 12px 30px;
                                text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>This link will expire in 15 minutes for security reasons.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    ${resetUrl}
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Connective: Password Reset Request',
            html: emailContent
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('🔥 Auth Service: Forgot password error:', error);
        next(error);
    }
};

/**
 * @desc Reset user password using token
 * @route POST /api/v1/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match or are missing.' });
        }
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        const confirmationEmail = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Successful</h2>
                <p>Hello ${user.firstName},</p>
                <p>Your password has been successfully reset for your Connective account.</p>
                <p>If you didn't make this change, please contact support immediately.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/login"
                        style="background-color: #28a745; color: white; padding: 12px 30px;
                                text-decoration: none; border-radius: 5px; display: inline-block;">
                        Login to Your Account
                    </a>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Connective: Password Reset Successful',
            html: confirmationEmail
        });

        res.status(200).json({ message: 'Password reset successful.' });

    } catch (error) {
        console.error('🔥 Auth Service: Reset password error:', error);
        next(error);
    }
};

/**
 * @desc Verify if a password reset token is valid
 * @route GET /api/v1/auth/verify-reset-token/:token
 * @access Public
 */
exports.verifyResetToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                valid: false,
                message: 'Invalid or expired reset token.'
            });
        }

        res.status(200).json({
            valid: true,
            message: 'Token is valid',
            email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        });

    } catch (error) {
        console.error('🔥 Auth Service: Verify token error:', error);
        next(error);
    }
};