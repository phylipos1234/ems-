# 🔧 Vercel Environment Variables Configuration

## Your Deployment URL
**Production URL**: `https://ems-585itrx2l-phylipos-projects.vercel.app`

---

## ✅ Required Environment Variables

Go to your Vercel Dashboard → Your Project → Settings → Environment Variables

Add these **exact** variables:

### 1. MONGO_URI
```
Name: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
```
**Replace** `username`, `password`, and `cluster.mongodb.net` with your actual MongoDB Atlas connection string.

### 2. JWT_SECRET
```
Name: JWT_SECRET
Value: [Any random secret string - keep it secure!]
```
Example: `my-super-secret-jwt-key-ems-2024-production`

### 3. NODE_ENV
```
Name: NODE_ENV
Value: production
```

### 4. FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://ems-585itrx2l-phylipos-projects.vercel.app
```

### 5. VITE_API_URL
```
Name: VITE_API_URL
Value: https://ems-585itrx2l-phylipos-projects.vercel.app/api
```

---

## 📋 Quick Copy-Paste

Copy and paste these into Vercel Environment Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://ems-585itrx2l-phylipos-projects.vercel.app
VITE_API_URL=https://ems-585itrx2l-phylipos-projects.vercel.app/api
```

**Remember**: Replace `username:password@cluster.mongodb.net` with your actual MongoDB connection string!

---

## 🔄 After Adding Variables

1. **Save** all environment variables
2. Go to **Deployments** tab
3. Click **"..."** on the latest deployment
4. Click **"Redeploy"**
5. Wait for redeployment to complete

---

## ✅ Verification

After redeployment, test:
- Visit: `https://ems-585itrx2l-phylipos-projects.vercel.app`
- Should see your login page
- API should work: `https://ems-585itrx2l-phylipos-projects.vercel.app/api`

---

## 🆘 Troubleshooting

**If CORS errors occur:**
- Make sure `FRONTEND_URL` is set exactly as shown above
- Redeploy after updating

**If API doesn't work:**
- Check `VITE_API_URL` is set correctly
- Verify the URL ends with `/api`

**If database connection fails:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)

