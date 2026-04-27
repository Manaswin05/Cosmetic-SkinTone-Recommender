# 🚀 Quick Start - Push & Deploy

## ✅ Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `lumina-beauty` (or your choice)
3. **DO NOT** check "Initialize with README"
4. Click "Create repository"

## ✅ Step 2: Push Your Code

Copy your repository URL from GitHub, then run:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/lumina-beauty.git
git branch -M main
git push -u origin main
```

## ✅ Step 3: Deploy Backend (Render)

1. Go to https://render.com → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** → Select your repository
4. Fill in:
   ```
   Name: lumina-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```
5. Click **"Create Web Service"**
6. **COPY THE URL** (e.g., `https://lumina-backend.onrender.com`)

## ✅ Step 4: Deploy Frontend (Render)

1. In Render, click **"New +"** → **"Static Site"**
2. Select the same repository
3. Fill in:
   ```
   Name: lumina-frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Click **"Create Static Site"**
5. Go to **"Redirects/Rewrites"** tab
6. Add rewrite rule:
   ```
   Source: /api/*
   Destination: https://lumina-backend.onrender.com/api/*
   Action: Rewrite
   ```
7. Save!

## ✅ Step 5: Test Your App

1. Visit your frontend URL (e.g., `https://lumina-frontend.onrender.com`)
2. Navigate to "Skin Analysis"
3. Upload a photo or use camera
4. Verify it works!

---

## 🎯 Alternative: Railway (Simpler, $5 credit)

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Railway auto-detects both services!
5. For backend, set: `cd backend && gunicorn app:app`
6. Done!

---

## 🎯 Alternative: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel:
1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Vercel auto-detects Vite
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
6. Deploy!

### Backend on Render:
Follow Step 3 above.

---

## 📊 Deployment Comparison

| Platform | Cost | Speed | Ease |
|----------|------|-------|------|
| **Render (Full)** | Free | Medium | Easy |
| **Railway** | $5/mo | Fast | Easiest |
| **Vercel + Render** | Free | Fastest | Medium |

---

## 🐛 Common Issues

**"Application failed to respond"**
- Wait 2-3 minutes for first deploy
- Check Render logs for errors
- Verify `gunicorn` is in requirements.txt

**CORS errors**
- Ensure rewrite rule is set correctly
- Check backend URL is correct
- Verify `flask-cors` is installed

**Camera not working**
- Must use HTTPS (Render provides this)
- Allow camera permissions in browser

---

## 📞 Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide
- Check [SETUP.md](SETUP.md) for troubleshooting
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

---

## ✨ Your URLs After Deployment

- **Frontend:** `https://YOUR-APP-NAME.onrender.com`
- **Backend:** `https://YOUR-BACKEND-NAME.onrender.com`
- **API Health:** `https://YOUR-BACKEND-NAME.onrender.com/api/health`

**Save these URLs!** You'll need them for testing and sharing.
