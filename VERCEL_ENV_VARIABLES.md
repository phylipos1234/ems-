# 🔧 Vercel Environment Variables Configuration

## Your Deployment URL
**Production URL**: `https://ems-kappa-ten.vercel.app`

---

## 📝 Required Environment Variables

Add these environment variables in your Vercel Dashboard:

### 1. MONGO_URI
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
```
**Description**: Your MongoDB Atlas connection string
**How to get**: MongoDB Atlas → Database → Connect → Connect your application

---

### 2. JWT_SECRET
```
JWT_SECRET=your-random-secret-key-here-make-it-long-and-secure
```
**Description**: Secret key for JWT token encryption
**Example**: `my-super-secret-jwt-key-12345-abcde-fghij-klmno`

---

### 3. NODE_ENV
```
NODE_ENV=production
```
**Description**: Environment type
**Value**: Always set to `production` for Vercel

---

### 4. FRONTEND_URL
```
FRONTEND_URL=https://ems-kappa-ten.vercel.app
```
**Description**: Your frontend application URL
**Important**: This is used for CORS configuration

---

### 5. VITE_API_URL
```
VITE_API_URL=https://ems-kappa-ten.vercel.app/api
```
**Description**: API base URL for frontend
**Important**: This tells your React app where to make API calls

---

## 🚀 How to Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **ems** project

### Step 2: Navigate to Environment Variables
1. Click **"Settings"** in the top menu
2. Click **"Environment Variables"** in the left sidebar

### Step 3: Add Each Variable
For each variable above:
1. Click **"Add New"**
2. Enter the **Name** (e.g., `MONGO_URI`)
3. Enter the **Value** (paste your value)
4. Select environments: **Production**, **Preview**, **Development** (or just Production)
5. Click **"Save"**

### Step 4: Redeploy
After adding all variables:
1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## ✅ Complete Environment Variables List

Copy and paste these into Vercel (replace placeholders with your actual values):

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ems?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-random-secret-key-here

# Environment
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://ems-kappa-ten.vercel.app

# API URL
VITE_API_URL=https://ems-kappa-ten.vercel.app/api
```

---

## 🔍 Verify Environment Variables

After adding variables and redeploying:

1. **Check Build Logs**: Make sure no errors related to missing variables
2. **Test API**: Visit `https://ems-kappa-ten.vercel.app/api`
   - Should return: `{"message":"API running","version":"1.0.0"}`
3. **Test Frontend**: Visit `https://ems-kappa-ten.vercel.app`
   - Should load your login page
4. **Check Browser Console**: Open DevTools → Console
   - Should see no CORS errors
   - API calls should work

---

## 🆘 Troubleshooting

### Variable Not Working?
- Make sure you **redeployed** after adding variables
- Check variable names are **exact** (case-sensitive)
- Verify values don't have extra spaces
- Check build logs for errors

### CORS Errors?
- Verify `FRONTEND_URL` is set to: `https://ems-kappa-ten.vercel.app`
- Make sure you redeployed after updating

### API Not Working?
- Verify `VITE_API_URL` is set to: `https://ems-kappa-ten.vercel.app/api`
- Check browser console for errors
- Verify MongoDB connection string is correct

---

## 📌 Quick Reference

**Your URLs:**
- Frontend: `https://ems-kappa-ten.vercel.app`
- API: `https://ems-kappa-ten.vercel.app/api`
- API Root: `https://ems-kappa-ten.vercel.app/api`

**Vercel Dashboard:**
- [vercel.com/dashboard](https://vercel.com/dashboard)
- Settings → Environment Variables

---

**Last Updated**: Based on deployment URL `https://ems-kappa-ten.vercel.app`
