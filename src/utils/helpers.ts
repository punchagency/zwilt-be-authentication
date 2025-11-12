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
  const [scheme, token] = authHeader.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// ============================================================================
// USER HELPERS
// ============================================================================

/**
 * Format user response data
 */
export function formatUserResponse(user: any) {
  const { _id: id, email, firstName, lastName, isActive, role, isSuperuser, createdAt, updatedAt } = user;
  return { id, email, firstName, lastName, isActive, role, isSuperuser, createdAt, updatedAt };
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
 * Requirements: minimum 8 characters, 1 lowercase, 1 uppercase, 1 special character
 */
export function isValidPassword(password: string): boolean {
  // Check minimum length
  if (password.length < AUTH.MIN_PASSWORD_LENGTH) {
    return false;
  }

  // Check for at least one lowercase letter
  const hasLowerCase = /[a-z]/.test(password);

  // Check for at least one uppercase letter
  const hasUpperCase = /[A-Z]/.test(password);

  // Check for at least one special character
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasLowerCase && hasUpperCase && hasSpecialChar;
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
