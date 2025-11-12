# zwilt-authentication

A Node.js/Express authentication API with MongoDB integration.

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode (development, staging, production) | development |
| `PORT` | Port number for the server | 8080 |
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
