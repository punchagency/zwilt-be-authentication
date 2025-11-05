import { Request, Response } from 'express';
import User from '../models/User';
import {
  generateToken,
  formatUserResponse,
  isValidPassword,
} from '../utils/helpers';
import {
  AUTH,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../utils/constants';

// ============================================================================
// REGISTER CONTROLLER
// ============================================================================

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.ALL_FIELDS_REQUIRED,
      });
      return;
    }

    if (!isValidPassword(password)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.PASSWORD_TOO_SHORT(AUTH.MIN_PASSWORD_LENGTH),
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken((user._id as any).toString());

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: {
        user: formatUserResponse(user),
        token,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
      return;
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
}

// ============================================================================
// LOGIN CONTROLLER
// ============================================================================

/**
 * Authenticate user and return token
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Generate JWT token
    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: formatUserResponse(user),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
}

// ============================================================================
// PROFILE CONTROLLER
// ============================================================================

/**
 * Get current user profile
 */
export async function getProfile(req: any, res: Response): Promise<void> {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_RETRIEVED,
      data: {
        user: formatUserResponse(user),
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
}

// ============================================================================
// LOGOUT CONTROLLER
// ============================================================================

/**
 * Logout user (client-side token removal)
 */
export function logout(req: Request, res: Response): void {
  res.json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  });
}
