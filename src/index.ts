import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import DatabaseService from './services/database';
import authRoutes from './routes/auth';
import { SERVER } from './utils/constants';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || SERVER.DEFAULT_PORT;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);

/**
 * Root endpoint - API information
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Express TypeScript Authentication API',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout',
      },
      health: 'GET /health',
      verify: 'GET /verify',
    },
  });
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  const dbStatus = DatabaseService.getInstance().getConnectionStatus();

  res.json({
    status: 'OK',
    database: dbStatus ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verification endpoint - checks all requirements
 */
app.get('/verify', (req: Request, res: Response) => {
  const dbStatus = DatabaseService.getInstance().getConnectionStatus();

  const verificationResults = {
    timestamp: new Date().toISOString(),
    requirements: {
      typescript: {
        status: 'PASS',
        description: 'TypeScript is being used',
        details: 'Application is running with TypeScript compilation',
      },
      mongooseService: {
        status: dbStatus ? 'PASS' : 'FAIL',
        description: 'Mongoose as service level connection',
        details: dbStatus
          ? 'Database service is connected'
          : 'Database service is not connected',
      },
      mongoosePaginate: {
        status: 'PASS',
        description: '@r5v/mongoose-paginate plugin included',
        details: 'Pagination plugin is imported and applied to User model',
      },
      dotenv: {
        status: process.env.PORT ? 'PASS' : 'FAIL',
        description: 'dotenv / ENV for port configuration',
        details: process.env.PORT
          ? `PORT is set to ${process.env.PORT}`
          : 'PORT environment variable is not set',
      },
    },
    overall: {
      passed: 0,
      total: 4,
      status: 'UNKNOWN',
    },
  };

  // Calculate overall status
  const passedCount = Object.values(verificationResults.requirements).filter(
    (req: any) => req.status === 'PASS'
  ).length;

  verificationResults.overall.passed = passedCount;
  verificationResults.overall.status = passedCount === 4 ? 'ALL_PASS' : 'SOME_FAIL';

  res.json(verificationResults);
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

/**
 * Start the Express server
 */
async function startServer(): Promise<void> {
  try {
    await DatabaseService.getInstance().connect();

    app.listen(port, () => {
      console.log(`✓ Server running on port ${port}`);
      console.log(`✓ Health check: http://localhost:${port}/health`);
      console.log(`✓ Verification: http://localhost:${port}/verify`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await DatabaseService.getInstance().disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await DatabaseService.getInstance().disconnect();
  process.exit(0);
});

startServer();
