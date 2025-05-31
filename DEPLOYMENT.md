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

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Select your `Imperium-Windows` repository

2. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-3 minutes)
   - Your application will be available at `https://your-app-name.vercel.app`

### Option 2: Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

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

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails with "Module not found"**
   - Ensure all dependencies are installed: `cd frontend && npm install`
   - Check for typos in import statements

2. **Assets not loading**
   - Verify assets are in `frontend/public/` directory
   - Check that file paths are correct (case-sensitive)

3. **Routing issues (404 on refresh)**
   - Ensure `vercel.json` rewrites are configured correctly
   - SPA routing should work with the current configuration

4. **Slow build times**
   - Check if all `node_modules` are properly excluded in `.gitignore`
   - Consider using Vercel's cache optimization

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in the repository for project-specific problems
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

## 🎉 Success!

Once deployed, your Imperium Windows dashboard will be live and accessible worldwide. The application includes:

- Modern glassmorphic UI
- AI-powered analytics
- Real-time data visualization
- Responsive design for all devices
- Optimized performance and SEO 