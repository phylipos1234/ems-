# 🔐 Environment Variables Setup for Vercel

## Your Deployment URL
**Base URL**: `https://ems-kappa-ten.vercel.app`

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **ems** project

### Step 2: Add Environment Variables
1. Click **Settings** → **Environment Variables**
2. Add these 5 variables:

| Variable Name | Value |
|--------------|-------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-random-secret-key` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://ems-kappa-ten.vercel.app` |
| `VITE_API_URL` | `https://ems-kappa-ten.vercel.app/api` |

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"..."** → **"Redeploy"**
3. Wait for deployment to complete

---

## 📋 Detailed Instructions

### 1. MONGO_URI
**What it is**: MongoDB database connection string

**How to get it**:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Database** → **Connect**
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `ems`

**Example**:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ems?retryWrites=true&w=majority
```

---

### 2. JWT_SECRET
**What it is**: Secret key for encrypting JWT tokens

**How to create**:
- Use any long random string
- Example: `my-super-secret-jwt-key-12345-abcde-fghij`

**Important**: Keep this secret! Don't share it publicly.

---

### 3. NODE_ENV
**What it is**: Environment type

**Value**: Always set to `production` for Vercel

---

### 4. FRONTEND_URL
**What it is**: Your frontend application URL

**Value**: 
```
https://ems-kappa-ten.vercel.app
```

**Why**: Used for CORS configuration in the backend

---

### 5. VITE_API_URL
**What it is**: API base URL for your React frontend

**Value**:
```
https://ems-kappa-ten.vercel.app/api
```

**Why**: Tells your React app where to make API calls

---

## ✅ Verification Checklist

After adding all variables and redeploying:

- [ ] Visit `https://ems-kappa-ten.vercel.app` - Should load login page
- [ ] Visit `https://ems-kappa-ten.vercel.app/api` - Should return `{"message":"API running"}`
- [ ] Try logging in - Should work without CORS errors
- [ ] Check browser console - No errors related to API calls
- [ ] Test features - Employee, Department, Salary management should work

---

## 🆘 Common Issues

### "Cannot connect to database"
- ✅ Check `MONGO_URI` is correct
- ✅ Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- ✅ Check database user password is correct

### "CORS policy blocked"
- ✅ Verify `FRONTEND_URL` is set to `https://ems-kappa-ten.vercel.app`
- ✅ Redeploy after updating

### "API calls failing"
- ✅ Verify `VITE_API_URL` is set to `https://ems-kappa-ten.vercel.app/api`
- ✅ Check browser console for specific errors
- ✅ Verify you redeployed after adding variables

---

## 📞 Need Help?

1. Check Vercel build logs for errors
2. Verify all 5 environment variables are set
3. Make sure you redeployed after adding variables
4. Check MongoDB Atlas connection settings

---

**Your Application URLs:**
- 🌐 Frontend: [https://ems-kappa-ten.vercel.app](https://ems-kappa-ten.vercel.app)
- 🔌 API: [https://ems-kappa-ten.vercel.app/api](https://ems-kappa-ten.vercel.app/api)

