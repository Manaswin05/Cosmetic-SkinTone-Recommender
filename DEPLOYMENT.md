# Lumina Beauty - Deployment Guide

This guide covers deploying the full-stack Lumina Beauty application (React frontend + Python Flask backend).

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

**Pros:**
- Free tier includes 750 hours/month
- Automatic deployments from GitHub
- Built-in SSL certificates
- Easy environment variable management
- Supports both static sites and web services

**Steps:**

1. **Push to GitHub** (see instructions below)

2. **Deploy Backend:**
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `lumina-backend`
     - **Root Directory:** `backend`
     - **Runtime:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn app:app`
     - **Environment Variables:**
       - `PYTHON_VERSION`: `3.11.0`
       - `MONGO_URI`: (optional, your MongoDB connection string)
   - Click "Create Web Service"
   - Note the backend URL (e.g., `https://lumina-backend.onrender.com`)

3. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect the same repository
   - Configure:
     - **Name:** `lumina-frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
   - Click "Create Static Site"

4. **Configure API Proxy:**
   - Update `vite.config.ts` to use the backend URL in production
   - Or use Render's rewrite rules in the dashboard

---

### Option 2: Railway

**Pros:**
- $5 free credit monthly
- Simpler configuration
- Automatic HTTPS
- Great for monorepos

**Steps:**

1. **Push to GitHub** (see instructions below)

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app) and sign up
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect both services

3. **Configure Services:**
   - **Backend Service:**
     - Root Directory: `backend`
     - Start Command: `gunicorn app:app`
     - Add environment variables if needed
   - **Frontend Service:**
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run preview` (or use static hosting)

---

### Option 3: Vercel (Frontend) + Render/Railway (Backend)

**For Frontend:**
- Deploy to Vercel (free, excellent for React)
- Build Command: `npm run build`
- Output Directory: `dist`

**For Backend:**
- Use Render or Railway as described above

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lumina_beauty
```

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## MongoDB Setup (Optional)

If you want to track analysis requests:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it as `MONGO_URI` environment variable in your backend deployment

---

## Cost Comparison

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Render** | 750 hrs/month | Spins down after 15 min inactivity |
| **Railway** | $5 credit/month | ~500 hours of usage |
| **Vercel** | Unlimited | Frontend only |
| **Netlify** | Unlimited | Frontend only |

---

## Recommended Setup

**Best Free Option:**
- Frontend: Vercel (fast, unlimited)
- Backend: Render (750 hrs free)
- Database: MongoDB Atlas (512MB free)

**Best Paid Option ($5-10/month):**
- Full Stack: Railway (simple, reliable)
- Database: MongoDB Atlas (free tier sufficient)

---

## Post-Deployment

1. Test the `/api/health` endpoint
2. Test skin analysis with a sample image
3. Monitor logs for any errors
4. Set up custom domain (optional)

---

## Troubleshooting

**Backend not responding:**
- Check if the service is running in the dashboard
- Verify environment variables are set
- Check logs for Python errors

**CORS errors:**
- Ensure `flask-cors` is installed
- Update CORS settings in `app.py` if needed

**Camera not working:**
- HTTPS is required for camera access
- All deployment platforms provide free SSL

---

## Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
