# Deployment Guide

This guide will help you deploy the Imperium Windows application to GitHub and Vercel.

## 📋 Prerequisites

- Node.js 18+ LTS installed
- Git installed and configured
- GitHub account
- Vercel account (can sign up with GitHub)

## 🚀 GitHub Deployment

### Step 1: Initialize Git Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Imperium Windows dashboard application"

# Create main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/Alexparkay/Imperium-Windows.git

# Push to GitHub
git push -u origin main
```

### Step 2: Verify Repository Structure

After pushing, your GitHub repository should show:
- ✅ `frontend/` directory with React application
- ✅ `README.md` with project documentation
- ✅ `vercel.json` for deployment configuration
- ✅ `.gitignore` excluding unnecessary files
- ✅ `LICENSE` file

## 🌐 Vercel Deployment

### Quick Deploy to Vercel

### Method 1: Automatic GitHub Integration (Recommended)

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import the `Imperium-Windows` repository

2. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Root Directory: **/** (leave as root)
   - Build Command: `cd frontend && npm ci && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: Leave empty

3. **Environment Variables:**
   No environment variables are required for this project.

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel --prod
```

## Project Structure

```
Imperium-Windows/
├── frontend/              # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json       # Frontend dependencies
│   └── dist/             # Build output (generated)
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── README.md
```

## Vercel Configuration

The `vercel.json` file is configured to:
- Build from the `frontend` directory
- Use Vite framework preset
- Output to `frontend/dist`
- Handle SPA routing with rewrites
- Set proper headers for Google Maps integration

## Troubleshooting

### Common Issues:

1. **"Could not read package.json" Error:**
   - Ensure the build command includes `cd frontend`
   - Check that `vercel.json` is properly configured

2. **Build Timeout:**
   - Build takes ~2-3 minutes due to 3D libraries
   - This is normal and expected

3. **Google Maps Not Loading:**
   - Check that headers are properly set in `vercel.json`
   - Ensure Cross-Origin policies are set to "unsafe-none"

4. **Large Bundle Size Warnings:**
   - These are expected due to 3D libraries (Three.js, Spline)
   - App still loads efficiently due to code splitting

### Build Process:

1. TypeScript compilation (`tsc`)
2. Vite build with code splitting
3. Asset optimization and minification
4. Deploy to Vercel edge network

## Performance Notes

- Initial load: ~2-3MB (normal for 3D applications)
- Subsequent loads: Much faster due to caching
- Assets are automatically optimized by Vercel
- CDN distribution for global performance

## GitHub Actions (Optional)

The `.github/workflows/deploy.yml` file provides automatic deployment on every push to main branch.

To set up:
1. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `ORG_ID`: Your Vercel organization ID  
   - `PROJECT_ID`: Your Vercel project ID

## Support

If deployment fails:
1. Check the build logs in Vercel dashboard
2. Ensure all files are committed to Git
3. Verify `frontend/package.json` has all dependencies
4. Test build locally with `npm run build` in frontend directory

## Production URL

Once deployed, your application will be available at:
`https://imperium-windows-[hash].vercel.app`

Custom domain can be configured in Vercel dashboard.

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are installed (`npm run install:all`)
- [ ] Build works locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] All environment variables are configured (if any)
- [ ] Static assets are in `frontend/public/`
- [ ] API endpoints are accessible (external APIs)

## 🔧 Environment Configuration

The application is configured to work with external APIs and doesn't require additional environment variables. However, if you need to add any:

1. **For Vercel**: Add environment variables in the Vercel dashboard under Project Settings > Environment Variables
2. **For local development**: Create a `.env.local` file in the `frontend/` directory

## 🌍 Custom Domain (Optional)

To add a custom domain to your Vercel deployment:

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy when you push to the `main` branch
- Create preview deployments for pull requests
- Show deployment status in GitHub

## 📊 Performance Optimization

The application is already optimized with:
- ✅ Code splitting and lazy loading
- ✅ Optimized bundle chunks
- ✅ Compressed assets
- ✅ Tree shaking for unused code
- ✅ Modern ES modules

## 🎉 Success!

Once deployed, your Imperium Windows dashboard will be live and accessible worldwide. The application includes:

- Modern glassmorphic UI
- AI-powered analytics
- Real-time data visualization
- Responsive design for all devices
- Optimized performance and SEO 