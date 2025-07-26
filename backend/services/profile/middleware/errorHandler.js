const errorHandler = (err, req, res, next) => {
    console.error('❌ Profile Service API Error:', err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    if (err.code === 11000) { // Duplicate key error
        statusCode = 409;
        message = `Duplicate field value: ${Object.keys(err.keyValue).join(', ')}. Please use another value.`;
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid Token. Authorization denied.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token Expired. Please log in again.';
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;