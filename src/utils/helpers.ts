import jwt, { SignOptions } from 'jsonwebtoken';
import { AUTH } from './constants';

// ============================================================================
// JWT HELPERS
// ============================================================================

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    AUTH.JWT_SECRET,
    { expiresIn: AUTH.JWT_EXPIRY } as any
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, AUTH.JWT_SECRET);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
}

// ============================================================================
// USER HELPERS
// ============================================================================

/**
 * Format user response data
 */
export function formatUserResponse(user: any) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= AUTH.MIN_PASSWORD_LENGTH;
}

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

/**
 * Create success response object
 */
export function createSuccessResponse(
  message: string,
  data?: any,
  statusCode: number = 200
) {
  return {
    statusCode,
    body: {
      success: true,
      message,
      ...(data && { data }),
    },
  };
}

/**
 * Create error response object
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  details?: any
) {
  return {
    statusCode,
    body: {
      success: false,
      message,
      ...(details && { details }),
    },
  };
}
