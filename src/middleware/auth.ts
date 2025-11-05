import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verifyToken, extractTokenFromHeader } from '../utils/helpers';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthRequest extends Request {
  user?: any;
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Middleware to authenticate JWT token
 * Requires valid Bearer token in Authorization header
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED,
      });
      return;
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    if (!user.isActive) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.ACCOUNT_DEACTIVATED,
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }
};

/**
 * Optional middleware to authenticate JWT token
 * Does not fail if token is missing or invalid
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
