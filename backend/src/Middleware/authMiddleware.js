const jwt = require('jsonwebtoken');

// Middleware to authenticate a user using JWT
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded; // This typically contains the user ID and other data encoded in the JWT

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
