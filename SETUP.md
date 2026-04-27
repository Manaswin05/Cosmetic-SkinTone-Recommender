# Quick Setup Guide

## Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first (don't initialize with README)
# Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Render (Recommended)

### Backend Deployment

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `lumina-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** Free
5. Add Environment Variables (optional):
   - `PYTHON_VERSION` = `3.11.0`
   - `MONGO_URI` = your MongoDB connection string (if using)
6. Click **"Create Web Service"**
7. **Copy the backend URL** (e.g., `https://lumina-backend.onrender.com`)

### Frontend Deployment

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name:** `lumina-frontend`
   - **Root Directory:** leave empty (root)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Rewrite Rule:
   - Go to **"Redirects/Rewrites"** tab
   - Add rule: `/api/*` → `https://lumina-backend.onrender.com/api/*`
5. Click **"Create Static Site"**

### Done! 🎉

Your app will be live at:
- Frontend: `https://lumina-frontend.onrender.com`
- Backend: `https://lumina-backend.onrender.com`

---

## Alternative: Deploy to Railway

1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect both services
5. Configure each service:
   - **Backend:** Set start command to `cd backend && gunicorn app:app`
   - **Frontend:** Set build command to `npm install && npm run build`
6. Add environment variables if needed
7. Done!

---

## Alternative: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Fastest Option)

1. Go to https://vercel.com and sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL
6. Deploy!

### Backend on Render

Follow the backend deployment steps above.

---

## Testing Your Deployment

1. Visit your frontend URL
2. Navigate to "Skin Analysis" page
3. Try uploading a photo or using camera
4. Check browser console for any errors
5. Verify `/api/health` endpoint works

---

## Troubleshooting

**Backend shows "Application failed to respond":**
- Check Render logs for Python errors
- Verify `gunicorn` is in requirements.txt
- Ensure `app:app` matches your Flask app variable name

**Frontend can't connect to backend:**
- Check CORS settings in `app.py`
- Verify the API proxy/rewrite rules
- Check browser console for CORS errors

**Camera not working:**
- Ensure you're using HTTPS (Render provides this automatically)
- Check browser permissions for camera access

---

## Cost Breakdown

**Free Tier (Render):**
- Backend: 750 hours/month (spins down after 15 min inactivity)
- Frontend: Unlimited
- Total: $0/month

**Paid Tier (Railway):**
- $5 credit/month
- Covers ~500 hours of backend runtime
- No spin-down delays

**Recommended for Production:**
- Vercel (Frontend): Free, fast CDN
- Render (Backend): $7/month for always-on
- MongoDB Atlas: Free 512MB
- **Total: $7/month**
