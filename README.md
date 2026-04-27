<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Beauty - AI Skin Tone Analysis

Advanced skin tone detection using OpenCV computer vision. Upload a photo or use your camera to get personalized cosmetic shade recommendations.

## 🎨 Features

- **Real-time Face Detection** - Haar cascade algorithm
- **Precise Skin Tone Analysis** - HSV/YCrCb color space filtering
- **K-Means Clustering** - Dominant color extraction
- **Shade Matching** - LAB color space distance calculation
- **Undertone Classification** - Warm, Cool, or Neutral
- **Product Recommendations** - Personalized based on your skin profile

## 🚀 Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

**Backend:**
- Python Flask
- OpenCV
- NumPy
- MongoDB (optional, for analytics)

## 📦 Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- pip

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

The backend API will run on `http://localhost:5000`

### Optional: MongoDB Setup

If you want to track analysis requests:

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
2. Set the `MONGO_URI` environment variable:
   ```bash
   export MONGO_URI="mongodb://localhost:27017"
   # or for Atlas:
   export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/lumina_beauty (currently doesn't exist)"
   ```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Render** (Recommended) - Free tier, full-stack support
- **Railway** - $5 free credit, simple setup
- **Vercel + Render** - Best performance (frontend on Vercel, backend on Render)

## 📁 Project Structure

```
.
├── src/                    # React frontend
│   ├── pages/
│   │   └── SkinAnalysis.tsx
│   └── components/
├── backend/                # Python Flask API
│   ├── app.py             # Main API (production-ready)
│   ├── app_enhanced.py    # Enhanced version with better accuracy
│   ├── shade_database.py  # Cosmetic shade database
│   └── requirements.txt
├── public/                 # Static assets
└── DEPLOYMENT.md          # Deployment guide
```

## 🔧 API Endpoints

- `POST /api/analyze-skin` - Analyze skin tone from base64 image
- `GET /api/health` - Health check
- `GET /api/requests` - Get analysis history (requires MongoDB)

## 🎯 How It Works

1. **Face Detection** - Haar cascade locates face in image
2. **Region Extraction** - Samples forehead, left cheek, right cheek
3. **Color Filtering** - HSV/YCrCb filters isolate skin pixels
4. **Clustering** - K-means finds dominant skin color
5. **Matching** - LAB color space calculates closest shade match
6. **Recommendations** - Suggests products based on skin category

## 📸 Camera Requirements

- HTTPS required for camera access (all deployment platforms provide free SSL)
- Good lighting recommended for accurate results
- Face should be clearly visible and centered

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🔗 Links

- [Deployment Guide](DEPLOYMENT.md)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [OpenCV Documentation](https://docs.opencv.org/)

---

Built with ❤️ using OpenCV and React
