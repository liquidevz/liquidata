# Environment Variables Configuration

## Overview
This document explains how environment variables are configured for the Liquidata frontend application across different environments.

## Environment Files

The project uses multiple environment files:

- **`.env`** - Development environment (default)
- **`.env.staging`** - Staging environment
- **`.env.production`** - Production environment
- **`.env.local`** - Local overrides (gitignored, not committed)

## Required Environment Variables

### NEXT_PUBLIC_API_URL
The backend API URL. This variable is exposed to the client-side code.

- **Development**: `http://localhost:5001` or `http://72.60.223.110:5001`
- **Staging**: `https://api.liquidata.dev`
- **Production**: `https://api.liquidata.dev`

### NEXT_PUBLIC_TINYMCE_API_KEY
The TinyMCE editor API key for rich text editing functionality.

## How Environment Variables Work

### Next.js Configuration
The `next.config.mjs` file explicitly exposes environment variables:

```javascript
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_TINYMCE_API_KEY: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
}
```

### Docker Build Process
Environment variables must be passed as **build arguments** because Next.js embeds them during the build process:

```yaml
build:
  args:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    NEXT_PUBLIC_TINYMCE_API_KEY: ${NEXT_PUBLIC_TINYMCE_API_KEY}
```

## Deployment Instructions

### Local Development
```bash
# Uses .env file automatically
npm run dev
```

### Docker Deployment (Production)
```bash
# Set environment variables before building
export NEXT_PUBLIC_API_URL=https://api.liquidata.dev
export NEXT_PUBLIC_TINYMCE_API_KEY=your_api_key_here

# Build and run with docker-compose
docker-compose up --build
```

### Docker Deployment (Using .env file)
Create a `.env` file in the project root:
```env
NEXT_PUBLIC_API_URL=https://api.liquidata.dev
NEXT_PUBLIC_TINYMCE_API_KEY=your_api_key_here
```

Then run:
```bash
docker-compose --env-file .env up --build
```

### Manual Build (Production)
```bash
# Set environment variables
export NEXT_PUBLIC_API_URL=https://api.liquidata.dev
export NEXT_PUBLIC_TINYMCE_API_KEY=your_api_key_here

# Build
npm run build

# Start
npm run start
```

## Troubleshooting

### Issue: API calls go to localhost in production
**Cause**: Environment variables not set during build process

**Solution**: 
1. Ensure `NEXT_PUBLIC_API_URL` is set as a build argument in Docker
2. Verify the variable is exported before running `docker-compose up --build`
3. Check that `next.config.mjs` includes the `env` configuration

### Issue: Environment variables not updating
**Cause**: Next.js caches environment variables during build

**Solution**:
1. Rebuild the Docker image: `docker-compose up --build`
2. For local development, restart the dev server
3. Clear `.next` cache: `rm -rf .next`

## API Configuration Files

### src/config/api.ts
Central API configuration with helper functions:
- `API_BASE_URL`: Base URL for all API calls
- `buildApiUrl()`: Builds full API URLs
- `apiRequest()`, `apiGet()`, `apiPost()`, etc.: Helper functions

### src/utils/adminApi.ts
Admin-specific API utilities with authentication:
- `adminFetch()`: Authenticated API calls
- `publicFetch()`: Public API calls

## Best Practices

1. **Never commit `.env.local`** - Use for local overrides only
2. **Use build arguments** - Always pass NEXT_PUBLIC_* variables as build args in Docker
3. **Verify after deployment** - Check browser console to confirm correct API URL
4. **Use fallbacks** - Code includes fallback to localhost for development

## Verification

To verify the correct API URL is being used:

1. Open browser developer console
2. Check Network tab for API calls
3. Verify requests go to the correct domain (not localhost in production)

Alternatively, add this to any component temporarily:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```
