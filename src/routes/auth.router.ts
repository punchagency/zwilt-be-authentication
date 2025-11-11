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
AuthRouter.post('/register', registerController);

/**
 * POST /login - Authenticate user and return token
 */
AuthRouter.post('/login', loginController);

/**
 * GET /profile - Get current user profile (requires authentication)
 */
AuthRouter.get('/profile', authenticateToken, getProfileController);

/**
 * POST /logout - Logout user (client-side token removal)
 */
AuthRouter.post('/logout', logoutController);
