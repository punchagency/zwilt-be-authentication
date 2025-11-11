import express, { Express, Request, Response } from 'express';
import DatabaseService from './services/database';
import { SERVER } from "./utils";
import { BaseRouter } from "./routes";

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
