# ✅ Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] Code pushed to GitHub repository
- [ ] `.gitignore` file configured correctly
- [ ] No sensitive data in code (no hardcoded passwords, API keys, etc.)
- [ ] All dependencies listed in `package.json` files

### MongoDB Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with password
- [ ] Network Access configured (IP: `0.0.0.0/0` for all IPs)
- [ ] Connection string copied and ready
- [ ] Connection string tested (can connect from local machine)

### Vercel Account
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Vercel has access to your repository

## Deployment Configuration

### Vercel Project Settings
- [ ] Project imported from GitHub
- [ ] Framework Preset: "Other" or "Vite"
- [ ] Root Directory: `./` (root)
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `cd frontend && npm install && cd ../server && npm install`

### Environment Variables
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Random secret key for JWT
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Will update after first deploy
- [ ] `VITE_API_URL` - Will update after first deploy

## First Deployment

- [ ] Deployment started
- [ ] Build logs checked (no errors)
- [ ] Deployment completed successfully
- [ ] Deployment URL obtained
- [ ] Environment variables updated with actual URL
- [ ] Application redeployed with updated variables

## Post-Deployment Verification

### Application Testing
- [ ] Application loads at Vercel URL
- [ ] Login page displays correctly
- [ ] Can login with existing credentials
- [ ] Dashboard loads after login
- [ ] Navigation works correctly
- [ ] No console errors in browser

### API Testing
- [ ] API root endpoint works: `/api`
- [ ] Authentication endpoints work: `/api/auth/login`
- [ ] Protected routes require authentication
- [ ] CORS configured correctly (no CORS errors)
- [ ] Database connection successful

### Feature Testing
- [ ] Employee list displays
- [ ] Can add new employee
- [ ] Can edit employee
- [ ] Can delete employee
- [ ] Department management works
- [ ] Salary management works
- [ ] File uploads work (if implemented with cloud storage)

## Troubleshooting (if needed)

### Build Issues
- [ ] Checked build logs for errors
- [ ] Verified all dependencies installed
- [ ] Confirmed build commands are correct
- [ ] Checked for missing files

### API Issues
- [ ] Verified `api/index.js` exists
- [ ] Checked `vercel.json` routes configuration
- [ ] Confirmed server dependencies installed
- [ ] Tested API endpoints directly

### Database Issues
- [ ] Verified `MONGO_URI` is correct
- [ ] Checked MongoDB Atlas Network Access
- [ ] Confirmed database user credentials
- [ ] Tested connection string format

### CORS Issues
- [ ] Updated `FRONTEND_URL` environment variable
- [ ] Redeployed application
- [ ] Checked CORS configuration in `server/index.js`

## Final Steps

- [ ] Application fully functional
- [ ] All features tested and working
- [ ] Performance acceptable
- [ ] Ready for production use
- [ ] Custom domain configured (optional)
- [ ] Team members have access (if needed)

## Notes

- Keep your MongoDB connection string secure
- Don't commit `.env` files to Git
- Monitor Vercel dashboard for deployment status
- Set up error monitoring (optional)
- Consider setting up automatic backups for database

---

**Deployment Date**: _______________
**Deployment URL**: _______________
**Status**: ☐ Success  ☐ Issues (see notes below)

**Issues/Notes**:
_________________________________________________
_________________________________________________
_________________________________________________

