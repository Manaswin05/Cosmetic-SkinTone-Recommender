"""
Lumina Beauty - Skin Color Detection Backend
Uses OpenCV for face detection and skin color analysis.
Matches detected skin tone to cosmetic shade database.
Tracks all analysis requests in MongoDB.
"""

import base64
import io
import math
import os
import traceback
from datetime import datetime, timezone

import cv2
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from PIL import Image
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

from shade_database import SHADE_DATABASE, PRODUCT_RECOMMENDATIONS

# Serve built React frontend from ../dist
DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "dist")

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="/")
CORS(app)

# MongoDB setup
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    mongo_client.admin.command("ping")
    db = mongo_client["lumina_beauty"]
    requests_collection = db["analysis_requests"]
    print("[OK] Connected to MongoDB")
except ConnectionFailure:
    print("[WARN] MongoDB not available -- request tracking disabled")
    requests_collection = None

# Load Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode a base64 image string to an OpenCV numpy array."""
    # Remove data URL prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    image_bytes = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # Convert PIL Image (RGB) to OpenCV format (BGR)
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def detect_face(image: np.ndarray) -> tuple:
    """Detect the largest face in the image using Haar cascade."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80),
        flags=cv2.CASCADE_SCALE_IMAGE,
    )

    if len(faces) == 0:
        return None

    # Return the largest face
    areas = [w * h for (x, y, w, h) in faces]
    largest_idx = np.argmax(areas)
    return faces[largest_idx]


def extract_skin_regions(image: np.ndarray, face_rect: tuple) -> np.ndarray:
    """
    Extract skin-colored pixels from strategic face regions:
    - Forehead (top portion of face)
    - Left cheek
    - Right cheek
    These areas are least likely to contain eyes, lips, or eyebrows.
    """
    x, y, w, h = face_rect

    # Define regions of interest (ROI) within the face
    regions = []

    # Forehead region: top 20-35% of face, middle 60%
    forehead_x = x + int(w * 0.2)
    forehead_y = y + int(h * 0.08)
    forehead_w = int(w * 0.6)
    forehead_h = int(h * 0.15)
    regions.append(image[forehead_y : forehead_y + forehead_h, forehead_x : forehead_x + forehead_w])

    # Left cheek: 55-75% down, left 15-40% of face
    left_cheek_x = x + int(w * 0.1)
    left_cheek_y = y + int(h * 0.55)
    left_cheek_w = int(w * 0.25)
    left_cheek_h = int(h * 0.2)
    regions.append(image[left_cheek_y : left_cheek_y + left_cheek_h, left_cheek_x : left_cheek_x + left_cheek_w])

    # Right cheek: 55-75% down, right 60-85% of face
    right_cheek_x = x + int(w * 0.65)
    right_cheek_y = y + int(h * 0.55)
    right_cheek_w = int(w * 0.25)
    right_cheek_h = int(h * 0.2)
    regions.append(image[right_cheek_y : right_cheek_y + right_cheek_h, right_cheek_x : right_cheek_x + right_cheek_w])

    # Combine all region pixels
    all_pixels = []
    for region in regions:
        if region.size > 0:
            all_pixels.append(region.reshape(-1, 3))

    if not all_pixels:
        return np.array([])

    return np.vstack(all_pixels)


def apply_skin_mask(pixels_bgr: np.ndarray) -> np.ndarray:
    """
    Filter pixels to keep only skin-colored ones using HSV color space.
    Skin in HSV: H(0-50), S(20-255), V(50-255)
    """
    if len(pixels_bgr) == 0:
        return pixels_bgr

    # Reshape for color conversion: (N, 1, 3)
    pixels_reshaped = pixels_bgr.reshape(-1, 1, 3).astype(np.uint8)
    hsv_pixels = cv2.cvtColor(pixels_reshaped, cv2.COLOR_BGR2HSV)
    hsv_pixels = hsv_pixels.reshape(-1, 3)

    # Skin color ranges in HSV
    lower_skin = np.array([0, 20, 50])
    upper_skin = np.array([50, 255, 255])

    # Create mask
    mask = np.all((hsv_pixels >= lower_skin) & (hsv_pixels <= upper_skin), axis=1)

    return pixels_bgr[mask]


def find_dominant_color(pixels_bgr: np.ndarray, k: int = 3) -> np.ndarray:
    """
    Find the dominant skin color using K-means clustering.
    Returns the BGR color of the largest cluster.
    """
    if len(pixels_bgr) < k:
        return np.mean(pixels_bgr, axis=0).astype(np.uint8) if len(pixels_bgr) > 0 else np.array([180, 160, 140], dtype=np.uint8)

    pixels = np.float32(pixels_bgr)

    # K-means clustering
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_PP_CENTERS)

    # Find the cluster with the most pixels
    unique, counts = np.unique(labels, return_counts=True)
    dominant_idx = unique[np.argmax(counts)]
    dominant_color = centers[dominant_idx].astype(np.uint8)

    return dominant_color


def bgr_to_lab(bgr: np.ndarray) -> np.ndarray:
    """Convert a single BGR pixel to LAB color space."""
    pixel = np.uint8([[bgr]])
    lab = cv2.cvtColor(pixel, cv2.COLOR_BGR2LAB)
    return lab[0][0].astype(np.float64)


def color_distance_lab(lab1: np.ndarray, lab2: np.ndarray) -> float:
    """Calculate Delta E (CIE76) color difference in LAB space."""
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(lab1, lab2)))


def classify_undertone(bgr_color: np.ndarray) -> str:
    """
    Classify undertone based on HSV hue and color ratios.
    - Warm: higher yellow/golden hues
    - Cool: higher pink/red hues
    - Neutral: balanced
    """
    # Convert to HSV
    pixel = np.uint8([[bgr_color]])
    hsv = cv2.cvtColor(pixel, cv2.COLOR_BGR2HSV)[0][0]
    hue = hsv[0]  # 0-180 in OpenCV

    # Also look at RGB ratios
    b, g, r = int(bgr_color[0]), int(bgr_color[1]), int(bgr_color[2])

    # Warm: more yellow-orange (hue 10-30), higher R and G relative to B
    # Cool: more pink-red (hue 0-10 or 170-180), higher R relative to G
    # Neutral: balanced

    warm_score = 0
    cool_score = 0

    # Hue-based scoring
    if 10 <= hue <= 30:
        warm_score += 2
    elif hue < 10 or hue > 165:
        cool_score += 2
    else:
        warm_score += 1

    # RGB ratio scoring
    rg_ratio = r / max(g, 1)
    rb_ratio = r / max(b, 1)

    if rg_ratio < 1.15 and rb_ratio > 1.2:
        warm_score += 1  # Yellow-golden
    elif rg_ratio > 1.2:
        cool_score += 1  # Pink-red

    if warm_score > cool_score + 1:
        return "Warm"
    elif cool_score > warm_score + 1:
        return "Cool"
    else:
        return "Neutral"


def match_shade(bgr_color: np.ndarray) -> dict:
    """
    Find the closest shade in the database using LAB color distance.
    Returns the matched shade info and confidence.
    """
    detected_lab = bgr_to_lab(bgr_color)

    best_match = None
    best_distance = float("inf")
    all_distances = []

    for shade in SHADE_DATABASE:
        shade_bgr = np.array(shade["rgb"][::-1], dtype=np.uint8)  # RGB to BGR
        shade_lab = bgr_to_lab(shade_bgr)
        distance = color_distance_lab(detected_lab, shade_lab)
        all_distances.append(distance)

        if distance < best_distance:
            best_distance = distance
            best_match = shade

    # Calculate confidence: inverse of distance, normalized
    # A distance of 0 = 100% match, distance of 40+ = low confidence
    max_good_distance = 40.0
    confidence = max(0, min(100, (1 - best_distance / max_good_distance) * 100))

    # Find top 3 closest shades
    sorted_indices = np.argsort(all_distances)[:3]
    nearby_shades = [
        {
            "code": SHADE_DATABASE[i]["code"],
            "name": SHADE_DATABASE[i]["name"],
            "hex": SHADE_DATABASE[i]["hex"],
            "category": SHADE_DATABASE[i]["category"],
            "undertone": SHADE_DATABASE[i]["undertone"],
            "distance": round(all_distances[i], 2),
        }
        for i in sorted_indices
    ]

    return {
        "bestMatch": best_match,
        "confidence": round(confidence, 1),
        "nearbyShades": nearby_shades,
    }


@app.route("/api/analyze-skin", methods=["POST"])
def analyze_skin():
    """
    Main endpoint: accepts a base64 face image, detects skin color,
    and returns shade match information.
    """
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        # 1. Decode image
        image = decode_base64_image(data["image"])

        # 2. Detect face
        face_rect = detect_face(image)
        if face_rect is None:
            return jsonify({
                "error": "No face detected. Please ensure your face is clearly visible with good lighting."
            }), 400

        x, y, w, h = face_rect

        # 3. Extract skin region pixels
        skin_pixels = extract_skin_regions(image, face_rect)
        if len(skin_pixels) == 0:
            return jsonify({
                "error": "Could not extract skin region. Please try a clearer photo."
            }), 400

        # 4. Apply skin color mask
        filtered_pixels = apply_skin_mask(skin_pixels)
        if len(filtered_pixels) < 50:
            # If too few pixels pass the filter, use unfiltered
            filtered_pixels = skin_pixels

        # 5. Find dominant skin color via K-means
        dominant_bgr = find_dominant_color(filtered_pixels, k=3)

        # Convert to RGB for frontend
        dominant_rgb = (int(dominant_bgr[2]), int(dominant_bgr[1]), int(dominant_bgr[0]))
        dominant_hex = "#{:02x}{:02x}{:02x}".format(*dominant_rgb)

        # 6. Classify undertone
        undertone = classify_undertone(dominant_bgr)

        # 7. Match to shade database
        shade_result = match_shade(dominant_bgr)
        best_match = shade_result["bestMatch"]

        # 8. Get product recommendations
        category = best_match["category"]
        recommendations = PRODUCT_RECOMMENDATIONS.get(category, PRODUCT_RECOMMENDATIONS["Medium"])

        # Build response
        response = {
            "success": True,
            "detectedColor": {
                "rgb": dominant_rgb,
                "hex": dominant_hex,
            },
            "undertone": undertone,
            "shadeMatch": {
                "code": best_match["code"],
                "name": best_match["name"],
                "category": best_match["category"],
                "hex": best_match["hex"],
                "undertone": best_match["undertone"],
                "description": best_match["description"],
            },
            "confidence": shade_result["confidence"],
            "nearbyShades": shade_result["nearbyShades"],
            "recommendations": recommendations,
            "faceDetected": {
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
            },
            "allShades": [
                {
                    "code": s["code"],
                    "name": s["name"],
                    "hex": s["hex"],
                    "category": s["category"],
                    "undertone": s["undertone"],
                }
                for s in SHADE_DATABASE
            ],
        }

        # Log request to MongoDB
        if requests_collection is not None:
            try:
                log_entry = {
                    "timestamp": datetime.now(timezone.utc),
                    "detectedColor": {"rgb": dominant_rgb, "hex": dominant_hex},
                    "undertone": undertone,
                    "shadeMatch": {
                        "code": best_match["code"],
                        "name": best_match["name"],
                        "category": best_match["category"],
                    },
                    "confidence": shade_result["confidence"],
                    "userAgent": request.headers.get("User-Agent", "unknown"),
                }
                requests_collection.insert_one(log_entry)
            except Exception as log_err:
                print(f"[WARN] Failed to log to MongoDB: {log_err}")

        return jsonify(response)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route("/api/requests", methods=["GET"])
def get_requests():
    """Retrieve analysis request history from MongoDB."""
    if requests_collection is None:
        return jsonify({"error": "MongoDB not available"}), 503

    try:
        limit = int(request.args.get("limit", 50))
        cursor = requests_collection.find(
            {}, {"_id": 0}
        ).sort("timestamp", -1).limit(limit)
        entries = list(cursor)
        # Convert datetime to ISO string for JSON serialization
        for entry in entries:
            if "timestamp" in entry:
                entry["timestamp"] = entry["timestamp"].isoformat()
        return jsonify({"requests": entries, "count": len(entries)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    mongo_status = "connected" if requests_collection is not None else "unavailable"
    return jsonify({"status": "ok", "service": "Lumina Skin Analyzer", "mongo": mongo_status})


# ── Serve React frontend for all non-API routes ──────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve the built React app. Falls back to index.html for client-side routing."""
    if path and os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")


if __name__ == "__main__":
    print("Lumina Skin Analyzer Backend starting...")
    print("API: http://localhost:5000/api/analyze-skin")
    app.run(host="0.0.0.0", port=5000, debug=True)
