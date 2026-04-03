@echo off
echo ========================================
echo SDHQ Content Optimizer - Git & Vercel Setup
echo ========================================
echo.

echo This script will help you set up Git and Vercel
echo for the SDHQ Content Optimizer project
echo.

echo Step 1: Check if Git is installed
git --version
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed! Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git is installed!
echo.

echo Step 2: Check if Vercel CLI is installed
vercel --version
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI is not installed. Installing now...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Vercel CLI!
        pause
        exit /b 1
    )
    echo Vercel CLI installed successfully!
) else (
    echo Vercel CLI is already installed!
)
echo.

echo Step 3: Navigate to project directory
cd /d "c:\Users\mrama\CascadeProjects\SDHQ Content Analyzer"
echo Current directory: %CD%
echo.

echo Step 4: Initialize Git repository (if not already done)
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - SDHQ Content Optimizer"
) else (
    echo Git repository already exists
)
echo.

echo Step 5: Connect to GitHub (if remote not set)
git remote -v | findstr "origin"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Please set up your GitHub repository first:
    echo 1. Go to https://github.com and create a new repository
    echo 2. Name it "sdhq-content-optimizer" 
    echo 3. Then run these commands:
    echo    git remote add origin https://github.com/YOUR_USERNAME/sdhq-content-optimizer.git
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    echo Press any key when you're ready to continue...
    pause
) else (
    echo Git remote is already configured
)
echo.

echo Step 6: Login to Vercel
echo Please login to Vercel when prompted:
vercel login
echo.

echo Step 7: Deploy to Vercel
echo Deploying SDHQ Content Optimizer...
vercel --prod
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your SDHQ Content Optimizer is now ready!
echo.
echo Important Notes:
echo - Make sure to set environment variables in Vercel dashboard
echo - Check that your app name matches: SDHQ Content Optimizer
echo - Test all pages show "Coming Soon" as expected
echo.

pause
