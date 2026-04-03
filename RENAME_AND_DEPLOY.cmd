@echo off
echo ========================================
echo SDHQ Content Optimizer - Rename & Deploy
echo ========================================
echo.

echo Step 1: Navigate to project directory
cd /d "c:\Users\mrama\CascadeProjects\SDHQ Content Analyzer"
echo Current directory: %CD%
echo.

echo Step 2: Check Git status
git status
echo.

echo Step 3: Add all changes to Git
git add .
echo.

echo Step 4: Commit changes with new app name
git commit -m "Updated app name to SDHQ Content Optimizer and simplified to Coming Soon pages"
echo.

echo Step 5: Push changes to GitHub
git push origin main
echo.

echo Step 6: Build and test locally
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please check errors above.
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Step 7: Deploy to Vercel (if Vercel CLI is installed)
vercel --prod
echo.

echo ========================================
echo All steps completed!
echo Your SDHQ Content Optimizer is now updated
echo ========================================
echo.

echo Next steps:
echo 1. Check your Vercel dashboard for deployment status
echo 2. Update any environment variables if needed
echo 3. Test your live application
echo.

pause
