const jwt = require('jsonwebtoken');

// Middleware to authenticate a user using JWT
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header or cookies
  let token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to the request object (e.g., userId, role)
    req.user = decoded;
   
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authentication failed.' });
    }

    return res.status(401).json({ message: 'Authentication failed, please try again.' });
  }
};

module.exports = authMiddleware;
