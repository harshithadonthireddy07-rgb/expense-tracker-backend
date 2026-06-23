const jwt = require('jsonwebtoken');

// This middleware runs BEFORE any protected route
// It checks if the user is logged in by verifying their token
const authMiddleware = (req, res, next) => {
    try {
        // Get token from request header
        // Frontend sends token like: Authorization: Bearer eyJhbGc...
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If no token found, user is not logged in
        if (!token) {
            return res.status(401).json({ message: 'No token, access denied' });
        }

        // Verify the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user ID to request so routes can use it
        req.userId = decoded.userId;

        // Move on to the actual route
        next();

    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = authMiddleware;