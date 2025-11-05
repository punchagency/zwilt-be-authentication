// ============================================================================
// APPLICATION CONSTANTS
// ============================================================================

/**
 * Authentication constants
 */
export const AUTH = {
  MIN_PASSWORD_LENGTH: 6,
  JWT_EXPIRY: '7d',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  BCRYPT_SALT_ROUNDS: 12,
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  ALL_FIELDS_REQUIRED: 'All fields are required',
  PASSWORD_TOO_SHORT: (length: number) =>
    `Password must be at least ${length} characters long`,
  USER_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',
  USER_NOT_FOUND: 'User not found',
  ACCESS_TOKEN_REQUIRED: 'Access token required',
  INVALID_TOKEN: 'Invalid or expired token',
  INTERNAL_ERROR: 'Internal server error',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_RETRIEVED: 'Profile retrieved successfully',
};

/**
 * Database constants
 */
export const DATABASE = {
  DEFAULT_URI: 'mongodb://localhost:27017/express-app',
  CONNECTION_TIMEOUT: 10000,
};

/**
 * Server constants
 */
export const SERVER = {
  DEFAULT_PORT: 3001,
};
