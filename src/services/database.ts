import mongoose from 'mongoose';

const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
};

// ============================================================================
// DATABASE SERVICE
// ============================================================================

/**
 * Singleton service for managing MongoDB database connections
 */
class DatabaseService {
  private static instance: DatabaseService;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Connect to MongoDB database
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('✓ Database already connected');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/express-app';

      await mongoose.connect(mongoUri, {
        connectTimeoutMS: DB_CONFIG.CONNECTION_TIMEOUT,
        serverSelectionTimeoutMS: DB_CONFIG.CONNECTION_TIMEOUT,
      });

      this.isConnected = true;
      console.log('✓ Database connected successfully');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('✗ Database connection failed:', errorMessage);

      // In production, fail fast on connection errors
      if (process.env.NODE_ENV === 'production') {
        console.error('✗ Cannot start server in production without database connection');
        throw error;
      }

      // In development, allow server to start but log the warning
      console.warn(
        '⚠ Server starting without database connection (development mode only)'
      );
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✓ Database disconnected successfully');
    } catch (error) {
      console.error('✗ Database disconnection failed:', error);
      throw error;
    }
  }

  /**
   * Get current database connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default DatabaseService;
