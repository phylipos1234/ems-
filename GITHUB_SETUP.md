# GitHub Setup & Push Instructions

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `ems` (or any name you prefer)
4. Description: "Employee Management System"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

Run these commands in your terminal (from the `/Users/m2/Desktop/ems` directory):

```bash
# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit: EMS application with Vercel deployment setup"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ems.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username. For example:
- If your username is `john-doe`, use: `https://github.com/john-doe/ems.git`

## Step 3: Verify Push

1. Go to your GitHub repository page
2. You should see all your files including:
   - `frontend/` folder
   - `server/` folder
   - `api/` folder
   - `vercel.json`
   - `DEPLOYMENT.md`
   - etc.

## Alternative: Using SSH (if you have SSH keys set up)

If you prefer SSH instead of HTTPS:

```bash
git remote add origin git@github.com:YOUR_USERNAME/ems.git
git branch -M main
git push -u origin main
```

## Important Notes

✅ **Push everything together** - Your frontend and server are in the same repository (monorepo), so push them together.

✅ **Don't push sensitive files** - The `.gitignore` file will exclude:
   - `node_modules/`
   - `.env` files (make sure your `.env` is not committed)
   - Build outputs
   - Uploaded files (optional)

✅ **After pushing**, you can connect this repository to Vercel for automatic deployments.

## Next Steps After Pushing

1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Follow the deployment steps in `DEPLOYMENT.md`

