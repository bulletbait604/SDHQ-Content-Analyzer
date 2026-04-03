# Deployment Guide: SDHQ Content Analyzer

## Deploying to Vercel via GitHub (Windows CMD)

### Prerequisites
- Windows 10/11 with Command Prompt
- Git installed
- GitHub account
- Vercel account
- Node.js 18+ installed

### Step 1: Prepare Your Local Repository

```cmd
# Navigate to your project directory
cd "c:\Users\mrama\CascadeProjects\SDHQ Content Analyzer"

# Install dependencies
npm install

# Run tests to ensure everything works
npm run build
npm run validate
```

### Step 2: Initialize Git Repository (if not already done)

```cmd
# Initialize git if not already done
git init

# Add all files to git
git add .

# Commit your changes
git commit -m "Initial commit - SDHQ Content Analyzer ready for deployment"
```

### Step 3: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "sdhq-content-analyzer")
4. Choose "Public" or "Private"
5. Do NOT initialize with README, license, or .gitignore (we already have these)
6. Click "Create repository"

### Step 4: Push to GitHub

```cmd
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sdhq-content-analyzer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Deploy to Vercel

#### Method 1: Using Vercel CLI (Recommended)

```cmd
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd "c:\Users\mrama\CascadeProjects\SDHQ Content Analyzer"
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name? sdhq-content-analyzer (or your choice)
# - Directory? . (current directory)
# - Want to override settings? No
```

#### Method 2: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_APP_URL`: `https://your-app-name.vercel.app`
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `KICK_CLIENT_ID`: Your Kick client ID (if using Kick OAuth)
   - `KICK_CLIENT_SECRET`: Your Kick client secret
   - `YOUTUBE_CLIENT_ID`: Your YouTube client ID (if using YouTube OAuth)
   - `YOUTUBE_CLIENT_SECRET`: Your YouTube client secret
6. Click "Deploy"

### Step 6: Configure Environment Variables

After deployment, you must add environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   OPENAI_API_KEY=your_actual_openai_key
   KICK_CLIENT_ID=your_kick_client_id
   KICK_CLIENT_SECRET=your_kick_client_secret
   YOUTUBE_CLIENT_ID=your_youtube_client_id
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   RAPIDAPI_KEY=your_rapidapi_key
   ```

### Step 7: Automatic Deployments

Once set up, every push to your GitHub main branch will automatically trigger a new deployment on Vercel.

### Common Issues & Solutions

#### Build Fails
```cmd
# Check for build errors locally
npm run build
npm run validate
```

#### Environment Variables Missing
- Ensure all required environment variables are set in Vercel dashboard
- Check `.env.example` for required variables

#### Git Issues
```cmd
# Check git status
git status

# If you have uncommitted changes
git add .
git commit -m "Fix deployment issues"
git push
```

### Testing Your Deployment

1. Visit your Vercel URL
2. Test all features:
   - Page loads correctly
   - Authentication works (if configured)
   - API endpoints function
   - Clip analysis features work

### Updating Your App

To update your deployed app:

```cmd
# Make changes to your code
git add .
git commit -m "Update: describe your changes"
git push
```

Vercel will automatically deploy your changes.

### Support

- For Vercel issues: https://vercel.com/docs
- For GitHub issues: https://docs.github.com
- For Next.js deployment: https://nextjs.org/docs/deployment

---

**Note**: This app requires API keys for full functionality. Make sure to configure all environment variables in Vercel before testing features like AI analysis.
