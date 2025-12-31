# ⚡ Vercel Setup - Do This Now!

## Your Deployment URL
**🌐 Application**: `https://ems-kappa-ten.vercel.app`

---

## 🚀 Step 1: Add Environment Variables in Vercel

1. **Go to**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click**: Your **ems** project
3. **Click**: **Settings** → **Environment Variables**
4. **Add these 5 variables**:

### Variable 1: MONGO_URI
```
Name: MONGO_URI
Value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ems?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB connection string)*

### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: your-random-secret-key-here
```
*(Use any long random string)*

### Variable 3: NODE_ENV
```
Name: NODE_ENV
Value: production
```

### Variable 4: FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://ems-kappa-ten.vercel.app
```

### Variable 5: VITE_API_URL
```
Name: VITE_API_URL
Value: https://ems-kappa-ten.vercel.app/api
```

---

## 🔄 Step 2: Redeploy

1. **Go to**: **Deployments** tab
2. **Click**: **"..."** on the latest deployment
3. **Click**: **"Redeploy"**
4. **Wait**: 2-5 minutes for deployment to complete

---

## ✅ Step 3: Test Your Application

1. **Visit**: [https://ems-kappa-ten.vercel.app](https://ems-kappa-ten.vercel.app)
2. **Test API**: [https://ems-kappa-ten.vercel.app/api](https://ems-kappa-ten.vercel.app/api)
   - Should show: `{"message":"API running","version":"1.0.0"}`
3. **Try logging in** with your credentials
4. **Check browser console** (F12) for any errors

---

## 📋 Quick Copy-Paste

If you want to copy all variables at once, here's the format:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key
NODE_ENV=production
FRONTEND_URL=https://ems-kappa-ten.vercel.app
VITE_API_URL=https://ems-kappa-ten.vercel.app/api
```

---

## 🎯 What's Fixed

✅ CORS configuration updated with your URL
✅ Documentation updated with correct URLs
✅ Environment variable templates created
✅ All references to old URL replaced

---

## 🔗 Your URLs

- **Frontend**: https://ems-kappa-ten.vercel.app
- **API**: https://ems-kappa-ten.vercel.app/api
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

**Next**: Add the environment variables in Vercel and redeploy! 🚀

