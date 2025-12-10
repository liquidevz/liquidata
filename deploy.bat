@echo off
REM Frontend Deployment Script for Windows
setlocal enabledelayedexpansion

REM Default environment
set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

echo 🚀 Starting frontend deployment for %ENVIRONMENT% environment

REM Validate environment
if not "%ENVIRONMENT%"=="local" if not "%ENVIRONMENT%"=="staging" if not "%ENVIRONMENT%"=="production" (
    echo ❌ Invalid environment. Use: local, staging, or production
    exit /b 1
)

REM Check if environment file exists
if not exist ".env.%ENVIRONMENT%" (
    echo ❌ Environment file .env.%ENVIRONMENT% not found
    exit /b 1
)

echo 📋 Using environment: %ENVIRONMENT%

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Build the application
echo 🔨 Building application for %ENVIRONMENT%...
if "%ENVIRONMENT%"=="local" (
    call npm run build
) else (
    call npm run build:%ENVIRONMENT%
)
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

REM Start the application
echo 🚀 Starting application...
if "%ENVIRONMENT%"=="local" (
    call npm run dev
) else (
    call npm run start:%ENVIRONMENT%
)

echo ✅ Frontend deployment completed successfully!