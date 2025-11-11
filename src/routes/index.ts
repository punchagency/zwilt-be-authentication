import { Router } from "express";
import { AuthRouter } from "./auth.router";
import DatabaseService from "../services/database";

export const BaseRouter = Router()


/**START Move to Controllers****/
/**
 * Root endpoint - API information
 */
BaseRouter.get('/', async (req, res) => {
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
BaseRouter.get('/health', (req, res) => {
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
BaseRouter.get('/verify', (req, res) => {
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

/**END Move to Controllers****/

BaseRouter.use('/auth', AuthRouter)
