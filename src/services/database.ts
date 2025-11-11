import mongoose from 'mongoose';

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
      const { DATABASE } = await import('../utils/constants');
      const mongoUri = DATABASE.DEFAULT_URI;

      await mongoose.connect(mongoUri);

      this.isConnected = true;
      console.log('✓ Database connected successfully');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('✗ Database connection failed:', errorMessage);
      console.log(
        '⚠ Server will continue without database connection for development purposes'
      );

      // Don't throw error in development - allow server to start
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
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
