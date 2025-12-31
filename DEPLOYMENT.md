# Vercel Deployment Guide

This guide will walk you through deploying your EMS (Employee Management System) application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (or your MongoDB connection string)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Repository

1. Make sure all your code is committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Set Up MongoDB Atlas (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you don't have one)
3. Get your connection string from Atlas
4. Make sure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your `ems` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Select "Other" or "Vite"
   - **Root Directory**: Leave as root (`/`)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install && cd ../server && npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   VITE_API_URL=https://your-app-name.vercel.app/api
   ```
   
   **Important**: Replace `your-app-name.vercel.app` with your actual Vercel deployment URL (you'll get this after first deployment)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for current directory)
   - Override settings? **No**

4. **Add Environment Variables**
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   vercel env add NODE_ENV
   vercel env add VITE_API_URL
   ```
   
   Enter the values when prompted.

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

### Step 4: Update Environment Variables After First Deployment

After your first deployment, Vercel will give you a URL like `https://your-app-name.vercel.app`.

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Update `FRONTEND_URL` to: `https://your-app-name.vercel.app`
4. Update `VITE_API_URL` to: `https://your-app-name.vercel.app/api`
5. Redeploy your application

### Step 5: Handle File Uploads

**Important**: Vercel serverless functions have limitations with file uploads. The `uploads` folder won't persist between deployments.

**Solutions**:
1. **Use Cloud Storage** (Recommended):
   - Upload files to AWS S3, Cloudinary, or similar
   - Update your upload middleware to use cloud storage

2. **Use Vercel Blob Storage**:
   - Install `@vercel/blob`
   - Update your upload logic to use Vercel Blob

### Step 6: Verify Deployment

1. Visit your deployment URL
2. Test the login functionality
3. Check if API endpoints are working
4. Test file uploads (if implemented)

## Project Structure for Vercel

```
ems/
├── api/
│   └── index.js          # Vercel serverless function wrapper
├── frontend/             # React frontend
│   ├── src/
│   ├── package.json
│   └── dist/            # Build output
├── server/              # Express backend
│   ├── controllers/
│   ├── models/
│   ├── router/
│   └── index.js
├── vercel.json          # Vercel configuration
└── package.json
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure build commands are correct
- Check Vercel build logs for specific errors

### API Routes Not Working
- Verify `vercel.json` routes are correct
- Check that `api/index.js` exists and exports the app
- Ensure environment variables are set

### CORS Errors
- Update `FRONTEND_URL` environment variable
- Check CORS configuration in `server/index.js`

### Database Connection Issues
- Verify `MONGO_URI` is set correctly
- Check MongoDB Atlas IP whitelist
- Ensure connection string includes authentication

### File Upload Issues
- Vercel serverless functions don't support persistent file storage
- Implement cloud storage solution (S3, Cloudinary, etc.)

## Alternative: Separate Frontend and Backend Deployment

If you encounter issues with the monorepo approach, you can:

1. **Deploy Frontend to Vercel**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Deploy Backend Separately**:
   - Use Railway, Render, or Heroku for backend
   - Update `VITE_API_URL` to point to backend URL

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

## Notes

- Vercel serverless functions have a 10-second timeout on the free tier
- File uploads need cloud storage (filesystem is read-only)
- Environment variables are automatically injected during build
- Each deployment creates a new URL (you can add a custom domain)


