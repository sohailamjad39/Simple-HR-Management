// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import HR from '../models/HR.js';

/**
 * Middleware: Protect routes
 * Verifies JWT, attaches HR user to req.user
 * @access Private (for authenticated HR users only)
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find HR by ID and attach to req.user (exclude password)
      const hr = await HR.findById(decoded.id).select('-password');

      if (!hr) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      if (!hr.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Account is inactive.',
        });
      }

      // Attach user to request object
      req.user = hr;

      // Proceed to next middleware/route handler
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token',
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      }

      // Any other JWT or internal error
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed',
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

export { protect };