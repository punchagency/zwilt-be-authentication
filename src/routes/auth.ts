import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  register,
  login,
  getProfile,
  logout,
} from '../controllers/authController';

const router = Router();

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /register - Register a new user
 */
router.post('/register', register);

/**
 * POST /login - Authenticate user and return token
 */
router.post('/login', login);

/**
 * GET /profile - Get current user profile (requires authentication)
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * POST /logout - Logout user (client-side token removal)
 */
router.post('/logout', logout);

export default router;
