# 🚀 Quick Start Guide - Deploy to Vercel

This is a condensed guide to get you deployed quickly. For detailed steps, see the other documentation files.

## ⚡ 5-Minute Deployment

### 1. Push to GitHub (2 minutes)
```bash
cd /Users/m2/Desktop/ems
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/ems.git
git branch -M main
git push -u origin main
```

### 2. Set Up MongoDB Atlas (2 minutes)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Database Access → Add user (save password!)
4. Network Access → Allow from anywhere (`0.0.0.0/0`)
5. Database → Connect → Get connection string
6. Replace `<password>` and `<dbname>` in connection string

### 3. Deploy to Vercel (1 minute)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Select **"Other"** ⚠️ (Important for monorepo!)
   - **Build Command**: `cd frontend && npm run build` (or leave empty - vercel.json handles it)
   - **Output Directory**: `frontend/dist` (or leave empty - vercel.json handles it)
   - **Install Command**: `cd frontend && npm install && cd ../server && npm install` (or leave empty - vercel.json handles it)
5. Add Environment Variables:
   ```
   MONGO_URI=your_connection_string
   JWT_SECRET=any-random-string
   NODE_ENV=production
   ```
6. Click "Deploy"

### 4. Update URLs (After First Deploy)
**Your Deployment URL**: `https://ems-585itrx2l-phylipos-projects.vercel.app`

1. Go to Settings → Environment Variables
2. Add/Update:
   ```
   FRONTEND_URL=https://ems-585itrx2l-phylipos-projects.vercel.app
   VITE_API_URL=https://ems-585itrx2l-phylipos-projects.vercel.app/api
   ```
3. Redeploy

**See [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) for complete environment variables setup.**

## 📚 Detailed Guides

- **Complete Step-by-Step**: [VERCEL_DEPLOYMENT_STEPS.md](./VERCEL_DEPLOYMENT_STEPS.md)
- **GitHub Setup**: [GITHUB_SETUP.md](./GITHUB_SETUP.md)
- **Full Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🆘 Common Issues

**Build fails?**
- Check build logs in Vercel
- Ensure install command includes both frontend and server

**API not working?**
- Verify `api/index.js` exists
- Check environment variables are set

**Database connection fails?**
- Verify MongoDB Network Access allows `0.0.0.0/0`
- Check connection string format

**CORS errors?**
- Update `FRONTEND_URL` with your actual Vercel URL
- Redeploy

## ✅ Success Indicators

- ✅ Application loads at your Vercel URL
- ✅ Login page appears
- ✅ Can login successfully
- ✅ Dashboard loads
- ✅ API calls work (check browser console)

---

**Need help?** Check the detailed guides or Vercel documentation.

