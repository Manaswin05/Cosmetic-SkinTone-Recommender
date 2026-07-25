# Lumina Beauty — Backend API

Flask-based REST API for skin tone analysis using OpenCV computer vision.

## Overview

The backend handles:
- **Face detection** using Haar cascade classifiers
- **Skin color extraction** via multi-color-space filtering (HSV + YCrCb)
- **Shade matching** using LAB color space Delta E calculations
- **Serving the built React frontend** as static files in production

## Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API runs on `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-skin` | Analyze skin tone from base64 image |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/requests` | Analysis history (requires MongoDB) |

## Configuration

| Variable | Default | Description |
|---|---|---|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `lumina_beauty` | MongoDB database name |
| `SECRET_KEY` | `dev-secret-...` | Flask secret key |
| `PORT` | `5000` | Server port |

## Processing Pipeline

1. **Face Detection** → Haar cascade with multiple detection passes
2. **Region Extraction** → Targets forehead + cheeks, avoids eyes/nose/mouth
3. **Color Filtering** → HSV and YCrCb dual-space skin isolation
4. **Outlier Removal** → Percentile-based extreme value filtering
5. **K-Means Clustering** → 5 clusters → dominant skin color
6. **LAB Matching** → Delta E (CIE76) against shade database
7. **Undertone Analysis** → Hue, saturation, and RGB ratio analysis

## Performance

- Processing time: **200–500ms** per image
- Supports images up to 4K resolution
- Face detection: ~95% success rate with good lighting
- Shade matching: within 2–3 shades of professional tools
