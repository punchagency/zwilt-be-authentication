# zwilt-authentication

A Node.js/Express authentication API with MongoDB integration.

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode (development, staging, production) | development |
| `PORT` | Port number for the server | 8080 |
| `LOG_LEVEL` | Logging level (error, warn, info, debug, silly) | info |
| `MONGO_PROTOCOL` | MongoDB connection protocol | mongodb+srv |
| `MONGO_USERNAME` | MongoDB username | - |
| `MONGO_PWD` | MongoDB password | - |
| `MONGO_URI` | MongoDB cluster URI | - |
| `MONGO_DB` | Database name | - |
| `JWT_SECRET` | Secret key for JWT token signing | your-super-secret-jwt-key-change-this-in-production |

Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

### Environment Configuration

- **Development/Staging** (`NODE_ENV=staging` or `NODE_ENV=development`): The application will load environment variables from the `.env` file.
- **Production** (`NODE_ENV=production`): The application will use environment variables loaded into the process instance. The `.env` file will not be loaded.

## Logging

The application uses **Winston** for structured logging with JSON format and UTC timestamps.

### Log Levels

The `LOG_LEVEL` environment variable controls the verbosity of logs:

| Level | Description |
|-------|-------------|
| `error` | Only error messages |
| `warn` | Warnings and errors |
| `info` | Info, warnings, and errors (default) |
| `debug` | Debug, info, warnings, and errors |
| `silly` | All messages including verbose debug info |

### Log Format

The logger automatically adapts its format based on the environment:

**Development** (`NODE_ENV=development` or not set):
- Human-readable format with colors
- Example: `info: Server started successfully`

**Production** (`NODE_ENV=production`):
- JSON format for machine parsing
- Example:
```json
{
  "level": "info",
  "message": "Server started successfully",
  "timestamp": "2025-11-14 07:40:00 [UTC]",
  "service": "express-api",
  "port": "8080",
  "environment": "production",
  "logLevel": "info"
}
```

### Request Tracking

Each incoming request is assigned a unique UUID (`requestId`) that is:
- Attached to the request object throughout its lifecycle
- Included in all log entries for that request
- Returned in the response headers as `X-Request-ID`

This allows you to trace a request through the entire application.

### Request/Response Logging

The application automatically logs:
- **Incoming requests**: Method, URL, IP address, user agent, and request ID
- **Outgoing responses**: Status code, latency (in milliseconds), and request ID

Example logs:

```json
{
  "level": "info",
  "message": "Incoming request",
  "timestamp": "2025-11-14 07:40:00 [UTC]",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/api/auth/login",
  "ip": "127.0.0.1"
}
```

```json
{
  "level": "info",
  "message": "Outgoing response",
  "timestamp": "2025-11-14 07:40:01 [UTC]",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "latency": "125ms"
}
```

### Using the Logger in Your Code

Import the logger from utils and use it throughout your application:

```typescript
import { logger } from './utils';

// Log at different levels
logger.info('User logged in', { userId: user.id });
logger.warn('Deprecated endpoint accessed', { endpoint: '/api/old' });
logger.error('Database connection failed', { error: err.message });
logger.debug('Processing request', { data: requestData });
```

### Adding Custom Transports

You can add additional transports (e.g., file logging, external services) using the `addTransport` function:

```typescript
import { addTransport, logger } from './utils';
import winston from 'winston';

// Add file transport for errors
addTransport(new winston.transports.File({ 
  filename: 'error.log', 
  level: 'error' 
}));

// Add file transport for all logs
addTransport(new winston.transports.File({ 
  filename: 'combined.log' 
}));
```
