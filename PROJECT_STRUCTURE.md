# Project Structure

## Overview
This is a modular Express.js TypeScript authentication API with a clean component-based architecture.

## Directory Structure

```
src/
├── controllers/          # Business logic for routes
│   └── authController.ts # Authentication controller (register, login, profile, logout)
│
├── middleware/           # Express middleware
│   └── auth.ts          # JWT authentication middleware
│
├── models/              # Mongoose schemas
│   └── User.ts          # User model with password hashing
│
├── routes/              # API route definitions
│   └── auth.ts          # Authentication routes
│
├── services/            # Business services
│   └── database.ts      # MongoDB connection service (singleton)
│
├── utils/               # Utility functions and constants
│   ├── constants.ts     # Application constants
│   ├── helpers.ts       # Helper functions (JWT, validation, formatting)
│   └── index.ts         # Barrel export
│
└── index.ts             # Main application entry point
```

## Component Breakdown

### Controllers (`src/controllers/`)
- **authController.ts**: Handles all authentication logic
  - `register()` - User registration
  - `login()` - User authentication
  - `getProfile()` - Retrieve user profile
  - `logout()` - User logout

### Middleware (`src/middleware/`)
- **auth.ts**: JWT authentication middleware
  - `authenticateToken` - Required authentication
  - `optionalAuth` - Optional authentication

### Models (`src/models/`)
- **User.ts**: Mongoose User schema
  - Email, password, firstName, lastName, isActive
  - Password hashing with bcrypt
  - Password comparison method
  - Pagination plugin support

### Routes (`src/routes/`)
- **auth.ts**: Clean route definitions
  - POST `/register` - Register new user
  - POST `/login` - Authenticate user
  - GET `/profile` - Get user profile (protected)
  - POST `/logout` - Logout user

### Services (`src/services/`)
- **database.ts**: Singleton database service
  - Connection management
  - Graceful shutdown
  - Connection status tracking

### Utils (`src/utils/`)
- **constants.ts**: Centralized constants
  - Authentication settings
  - HTTP status codes
  - Error/success messages
  - Database configuration
  - Server configuration

- **helpers.ts**: Reusable utility functions
  - JWT token generation and verification
  - Token extraction from headers
  - User response formatting
  - Email and password validation
  - Response object creation

## Key Features

✅ **Modular Architecture** - Separated concerns with controllers, middleware, and services
✅ **Type Safety** - Full TypeScript support with proper typing
✅ **Constants Management** - Centralized constants for easy maintenance
✅ **Helper Functions** - Reusable utilities to avoid code duplication
✅ **Error Handling** - Comprehensive error handling with meaningful messages
✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Security** - Bcrypt hashing with salt rounds
✅ **Database Service** - Singleton pattern for database connections
✅ **Clean Code** - Well-organized, documented, and formatted code
✅ **Graceful Shutdown** - Proper cleanup on server termination

## Data Flow

```
Request
  ↓
Routes (auth.ts)
  ↓
Middleware (auth.ts) - if protected route
  ↓
Controllers (authController.ts)
  ↓
Models (User.ts)
  ↓
Database (database.ts)
  ↓
Response
```

## Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Profile (Protected)
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Logout
```bash
POST /api/auth/logout
```

## Environment Variables

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/express-app
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
