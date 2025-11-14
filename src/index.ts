import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import DatabaseService from './services/database';
import { SERVER, logger } from "./utils";
import { BaseRouter } from "./routes";
import { requestIdMiddleware } from './middleware/requestId';
import { requestLoggerMiddleware } from './middleware/requestLogger';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

// Load environment variables from .env file BEFORE initializing other modules
// This ensures all environment variables are available when modules are initialized
if (process.env.NODE_ENV !== 'production') {
  const result = dotenv.config({ quiet: true });

  if (result.error) {
    console.error('✗ Failed to load .env file:', result.error);
  } else {
    const envCount = Object.keys(result.parsed || {}).length;
    console.log(`✓ Loaded ${envCount} environment variables from .env`);
  }
} else {
  console.log('✓ Running in production mode - using process environment variables');
}

const app: Express = express();
const port = process.env.PORT || SERVER.PORT;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Request ID middleware - must be first to attach ID to all requests
app.use(requestIdMiddleware);

// Request logging middleware - logs incoming and outgoing requests
app.use(requestLoggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// ROUTES
// ============================================================================

app.use( BaseRouter);


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
      logger.info('Server started successfully');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}
//TODO: ADD error handling middleware
// ===========================================================================
// ERROR HANDLING
// ===========================================================================


// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully (SIGINT)...');
  await DatabaseService.getInstance().disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully (SIGTERM)...');
  await DatabaseService.getInstance().disconnect();
  process.exit(0);
});

startServer();
