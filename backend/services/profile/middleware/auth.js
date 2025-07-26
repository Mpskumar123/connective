const jwt = require('jsonwebtoken');
// const { User } = require('../models/User'); // REMOVED: Profile Service should not directly access Auth Service's User model

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Profile Service Auth - Decoded JWT:", decoded); // For debugging

    // In Profile service, we primarily trust the JWT's validity and the userId within it.
    // We assume the Auth Service is the source of truth for user existence.
    req.user = {
      id: decoded.userId, // The user's _id from the Auth Service
      role: decoded.role,
      userType: decoded.userType
    };

    next();
  } catch (error) {
    console.error('Profile Service - Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = authenticateUser;