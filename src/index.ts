import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import DatabaseService from './services/database';
import { SERVER } from "./utils";
import { BaseRouter } from "./routes";

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
      console.log(`✓ Server running on port ${port}`);
      console.log(`✓ Health check: http://localhost:${port}/health`);
      console.log(`✓ Verification: http://localhost:${port}/verify`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
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
