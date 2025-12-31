# 🚀 Vercel Deployment - Step by Step Guide

Follow these steps to deploy your EMS application to Vercel.

## ✅ Prerequisites Checklist

- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string ready
- [ ] Vercel account created (sign up at [vercel.com](https://vercel.com))

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create/Verify MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Create a free cluster (if you don't have one)
4. Wait for cluster to finish creating (2-3 minutes)

### 1.2 Configure Database Access
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Vercel to connect to your database
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `ems`)
7. **Save this connection string** - you'll need it for Vercel

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ems?retryWrites=true&w=majority
```

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find your `ems` repository
4. Click **"Import"** next to it

### 2.3 Configure Project Settings

**IMPORTANT**: Configure these settings carefully:

1. **Project Name**: Keep default or change to `ems` (optional)

2. **Framework Preset**: 
   - Select **"Other"** or **"Vite"**

3. **Root Directory**: 
   - Leave as **`./`** (root directory)

4. **Build and Output Settings**:
   - Click **"Override"** to customize
   - **Build Command**: 
     ```
     cd frontend && npm run build
     ```
   - **Output Directory**: 
     ```
     frontend/dist
     ```
   - **Install Command**: 
     ```
     cd frontend && npm install && cd ../server && npm install
     ```

5. **Environment Variables**: 
   - Click **"Environment Variables"** section
   - Add these variables one by one:

   | Name | Value | Description |
   |------|-------|-------------|
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
   | `JWT_SECRET` | `your-secret-key-here` | Any random string (e.g., `my-super-secret-jwt-key-12345`) |
   | `NODE_ENV` | `production` | Environment type |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | **Leave empty for now** - update after first deploy |
   | `VITE_API_URL` | `https://your-app.vercel.app/api` | **Leave empty for now** - update after first deploy |

   **Note**: For `FRONTEND_URL` and `VITE_API_URL`, you'll update these after the first deployment with your actual Vercel URL.

6. Click **"Deploy"** button

### 2.4 Wait for Deployment
- Vercel will:
  1. Install dependencies
  2. Build your frontend
  3. Set up serverless functions
  4. Deploy everything
- This takes 2-5 minutes
- Watch the build logs for any errors

---

## Step 3: Update Environment Variables After First Deployment

After deployment completes, you'll get a URL like: `https://ems-xxxxx.vercel.app`

### 3.1 Get Your Deployment URL
1. In Vercel Dashboard, click on your project
2. You'll see your deployment URL at the top
3. Copy the full URL (e.g., `https://ems-abc123.vercel.app`)

### 3.2 Update Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Find `FRONTEND_URL` and click **Edit**
   - Update value to: `https://your-actual-url.vercel.app`
3. Find `VITE_API_URL` and click **Edit**
   - Update value to: `https://your-actual-url.vercel.app/api`
4. Save changes

### 3.3 Redeploy
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic redeploy

---

## Step 4: Verify Deployment

### 4.1 Test Your Application
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. You should see your login page
3. Try logging in with your credentials
4. Test the main features:
   - [ ] Login works
   - [ ] Dashboard loads
   - [ ] API calls work (check browser console)
   - [ ] Navigation works

### 4.2 Check API Endpoints
1. Visit: `https://your-app.vercel.app/api`
2. You should see: `{"message":"API running","version":"1.0.0"}`

### 4.3 Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for any errors
4. Go to **Network** tab
5. Check if API calls are successful

---

## Step 5: Set Up Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's instructions to configure DNS
4. Wait for DNS propagation (can take up to 24 hours)

---

## 🔧 Troubleshooting

### Build Fails

**Error**: "Module not found" or "Cannot find module"
- **Solution**: Make sure `Install Command` includes both frontend and server:
  ```
  cd frontend && npm install && cd ../server && npm install
  ```

**Error**: "Build command failed"
- **Solution**: Check build logs, ensure all dependencies are in `package.json`

### API Routes Return 404

**Problem**: `/api/*` routes not working
- **Solution**: 
  1. Verify `api/index.js` exists
  2. Check `vercel.json` routes configuration
  3. Ensure server dependencies are installed

### Database Connection Fails

**Error**: "MongoDB Connection Error"
- **Solutions**:
  1. Verify `MONGO_URI` is set correctly in Vercel
  2. Check MongoDB Atlas Network Access (should allow `0.0.0.0/0`)
  3. Verify database user password is correct
  4. Check connection string format

### CORS Errors

**Error**: "CORS policy blocked"
- **Solution**: 
  1. Update `FRONTEND_URL` environment variable with your Vercel URL
  2. Redeploy the application

### File Upload Issues

**Problem**: File uploads don't work
- **Note**: Vercel serverless functions don't support persistent file storage
- **Solution**: You need to implement cloud storage:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage
  - Or deploy backend separately (Railway, Render, etc.)

---

## 📝 Quick Reference

### Environment Variables Summary

```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ems?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
VITE_API_URL=https://your-app.vercel.app/api
```

### Vercel Dashboard Links
- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Support**: [vercel.com/support](https://vercel.com/support)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported to Vercel
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Deployment URL obtained
- [ ] Environment variables updated with actual URL
- [ ] Application redeployed
- [ ] Login tested
- [ ] API endpoints tested
- [ ] Application working correctly

---

## 🎉 Success!

If everything works, your application is now live on Vercel! 

**Next Steps**:
- Share your deployment URL with others
- Set up automatic deployments (already enabled by default)
- Monitor your application in Vercel Dashboard
- Consider setting up a custom domain

---

## Need Help?

- Check Vercel build logs for detailed error messages
- Review the `DEPLOYMENT.md` file for more details
- Visit [Vercel Documentation](https://vercel.com/docs)
- Check MongoDB Atlas logs if database issues occur

