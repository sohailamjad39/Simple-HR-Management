// server/routes/authRoutes.js
import express from 'express';
import { registerHR, loginHR, getMe } from '../controllers/authController.js';
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

export default router;