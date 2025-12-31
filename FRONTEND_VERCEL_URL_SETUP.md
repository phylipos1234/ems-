# Frontend Vercel URL Configuration

## ✅ Changes Made

Your frontend has been updated to use your Vercel deployment URL:
**https://ems-585itrx2l-phylipos-projects.vercel.app**

### Files Updated:

1. **`frontend/src/utils/config.js`** (NEW)
   - Created utility functions for getting API and image URLs
   - Automatically detects Vercel environment from `VITE_API_URL`

2. **`frontend/src/pages/Login.jsx`**
   - Fixed hardcoded localhost URL
   - Now uses `axiosInstance` which respects environment variables

3. **`frontend/src/pages/EmployeeProfile.jsx`**
   - Updated image URLs to use `getImageUrl()` utility
   - Works with both localhost and Vercel

4. **`frontend/src/components/dashboard/EmployeeSidebar.jsx`**
   - Updated profile image URL to use utility function

5. **`frontend/src/components/employee/EmployeeList.jsx`**
   - Updated employee image URLs to use utility function

## 🔧 How It Works

The frontend now automatically detects the environment:

- **Local Development**: Uses `http://localhost:5000` (from `.env`)
- **Vercel Production**: Uses your Vercel URL (from Vercel environment variables)

### Environment Variable Required in Vercel:

Make sure you have this environment variable set in Vercel:

```
VITE_API_URL=https://ems-585itrx2l-phylipos-projects.vercel.app/api
```

## 📝 Next Steps

1. **Set Environment Variable in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add/Update: `VITE_API_URL` = `https://ems-585itrx2l-phylipos-projects.vercel.app/api`
   - Make sure it's set for **Production** environment

2. **Redeploy**:
   - After setting the environment variable, redeploy your application
   - Or push a new commit to trigger automatic deployment

3. **Test**:
   - Visit your Vercel URL
   - Test login functionality
   - Verify images load correctly
   - Check browser console for any errors

## 🎯 What This Fixes

- ✅ All API calls now use the correct Vercel URL
- ✅ All image URLs automatically use the correct base URL
- ✅ No more hardcoded localhost URLs
- ✅ Works in both development and production

## 🔍 Verification

After redeploying, check:

1. **Browser Console** (F12):
   - No CORS errors
   - API calls go to correct URL
   - Images load correctly

2. **Network Tab**:
   - API requests go to: `https://ems-585itrx2l-phylipos-projects.vercel.app/api/*`
   - Image requests go to: `https://ems-585itrx2l-phylipos-projects.vercel.app/uploads/*`

3. **Application**:
   - Login works
   - Images display correctly
   - All features function properly

---

**Note**: The utility functions automatically handle URL construction, so you don't need to manually update URLs when deploying to different environments.

