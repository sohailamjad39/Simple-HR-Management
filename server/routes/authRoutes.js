// server/routes/authRoutes.js
import express from 'express';
import {
  registerHR,
  loginHR,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new HR
 * @access  Public
 */
router.post('/register', registerHR);

/**
 * @route   POST /api/auth/login
 * @desc    Login HR & get token
 * @access  Public
 */
router.post('/login', loginHR);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in HR profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password/:token', resetPassword);

export default router;