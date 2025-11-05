import { Router } from "express";
import { BaseRouter } from "./index";
import { getProfileController, loginController, registerController,logoutController  } from "../controllers";
import { authenticateToken } from "../middleware/auth";


export const AuthRouter = Router()

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /register - Register a new user
 */
BaseRouter.post('/register', registerController);

/**
 * POST /login - Authenticate user and return token
 */
BaseRouter.post('/login', loginController);

/**
 * GET /profile - Get current user profile (requires authentication)
 */
BaseRouter.get('/profile', authenticateToken, getProfileController);

/**
 * POST /logout - Logout user (client-side token removal)
 */
BaseRouter.post('/logout', logoutController);