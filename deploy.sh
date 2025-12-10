#!/bin/bash

# Frontend Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${GREEN}🚀 Starting frontend deployment for ${ENVIRONMENT} environment${NC}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(local|staging|production)$ ]]; then
    echo -e "${RED}❌ Invalid environment. Use: local, staging, or production${NC}"
    exit 1
fi

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${YELLOW}📋 Loading environment variables from .env.${ENVIRONMENT}${NC}"
    export $(cat .env.${ENVIRONMENT} | xargs)
else
    echo -e "${RED}❌ Environment file .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Build the application
echo -e "${YELLOW}🔨 Building application for ${ENVIRONMENT}...${NC}"
if [ "$ENVIRONMENT" = "local" ]; then
    npm run build
else
    npm run build:${ENVIRONMENT}
fi

# Start the application
echo -e "${YELLOW}🚀 Starting application...${NC}"
if [ "$ENVIRONMENT" = "local" ]; then
    npm run dev
else
    npm run start:${ENVIRONMENT}
fi

echo -e "${GREEN}✅ Frontend deployment completed successfully!${NC}"