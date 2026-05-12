"""
Lumina Beauty - Enhanced Skin Color Detection Backend
Improved OpenCV skin detection with multiple algorithms and better accuracy.
"""

import base64
import io
import math
import os
import traceback
from datetime import datetime, timezone

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

from shade_database import SHADE_DATABASE, PRODUCT_RECOMMENDATIONS

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
CORS(app)

# MongoDB setup
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.environ.get("DATABASE_NAME", "lumina_beauty")
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    mongo_client.admin.command("ping")
    db = mongo_client[DATABASE_NAME]
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
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    image_bytes = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def detect_face(image: np.ndarray) -> tuple:
    """Detect the largest face using Haar cascade with multiple scales."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply histogram equalization for better detection
    gray = cv2.equalizeHist(gray)
    
    # Try multiple detection parameters for better accuracy
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.05,
        minNeighbors=5,
        minSize=(60, 60),
        flags=cv2.CASCADE_SCALE_IMAGE,
    )

    if len(faces) == 0:
        # Try again with more lenient parameters
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(40, 40),
        )
    
    if len(faces) == 0:
        return None

    # Return the largest face
    areas = [w * h for (x, y, w, h) in faces]
    largest_idx = np.argmax(areas)
    return faces[largest_idx]


def extract_skin_regions_enhanced(image: np.ndarray, face_rect: tuple) -> tuple:
    """
    Enhanced skin extraction with multiple methods:
    1. Strategic facial regions (forehead, cheeks)
    2. HSV-based skin segmentation
    3. YCrCb color space filtering
    Returns both the pixels and a debug image showing the regions.
    """
    x, y, w, h = face_rect
    
    # Create debug image
    debug_img = image.copy()
    cv2.rectangle(debug_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    regions = []
    
    # Forehead region: top 10-25% of face, middle 60%
    forehead_x = x + int(w * 0.2)
    forehead_y = y + int(h * 0.1)
    forehead_w = int(w * 0.6)
    forehead_h = int(h * 0.15)
    forehead_region = image[forehead_y:forehead_y + forehead_h, forehead_x:forehead_x + forehead_w]
    if forehead_region.size > 0:
        regions.append(forehead_region.reshape(-1, 3))
        cv2.rectangle(debug_img, (forehead_x, forehead_y), 
                     (forehead_x + forehead_w, forehead_y + forehead_h), (255, 0, 0), 2)

    # Left cheek: 50-70% down, left 10-35% of face
    left_cheek_x = x + int(w * 0.1)
    left_cheek_y = y + int(h * 0.5)
    left_cheek_w = int(w * 0.25)
    left_cheek_h = int(h * 0.2)
    left_cheek = image[left_cheek_y:left_cheek_y + left_cheek_h, left_cheek_x:left_cheek_x + left_cheek_w]
    if left_cheek.size > 0:
        regions.append(left_cheek.reshape(-1, 3))
        cv2.rectangle(debug_img, (left_cheek_x, left_cheek_y),
                     (left_cheek_x + left_cheek_w, left_cheek_y + left_cheek_h), (255, 0, 0), 2)

    # Right cheek: 50-70% down, right 65-90% of face
    right_cheek_x = x + int(w * 0.65)
    right_cheek_y = y + int(h * 0.5)
    right_cheek_w = int(w * 0.25)
    right_cheek_h = int(h * 0.2)
    right_cheek = image[right_cheek_y:right_cheek_y + right_cheek_h, right_cheek_x:right_cheek_x + right_cheek_w]
    if right_cheek.size > 0:
        regions.append(right_cheek.reshape(-1, 3))
        cv2.rectangle(debug_img, (right_cheek_x, right_cheek_y),
                     (right_cheek_x + right_cheek_w, right_cheek_y + right_cheek_h), (255, 0, 0), 2)

    # Combine all pixels
    if not regions:
        return np.array([]), debug_img

    all_pixels = np.vstack(regions)
    return all_pixels, debug_img


def apply_multi_color_space_filter(pixels_bgr: np.ndarray) -> np.ndarray:
    """
    Apply skin detection using multiple color spaces for better accuracy:
    - HSV color space
    - YCrCb color space
    Returns pixels that pass both filters.
    """
    if len(pixels_bgr) == 0:
        return pixels_bgr

    # HSV filtering
    pixels_reshaped = pixels_bgr.reshape(-1, 1, 3).astype(np.uint8)
    hsv_pixels = cv2.cvtColor(pixels_reshaped, cv2.COLOR_BGR2HSV).reshape(-1, 3)
    
    # HSV skin range (more permissive)
    hsv_mask = np.all((hsv_pixels >= [0, 15, 40]) & (hsv_pixels <= [50, 255, 255]), axis=1)
    
    # YCrCb filtering (better for diverse skin tones)
    ycrcb_pixels = cv2.cvtColor(pixels_reshaped, cv2.COLOR_BGR2YCrCb).reshape(-1, 3)
    
    # YCrCb skin range
    ycrcb_mask = np.all((ycrcb_pixels >= [0, 133, 77]) & (ycrcb_pixels <= [255, 173, 127]), axis=1)
    
    # Combine masks (pixels that pass either filter)
    combined_mask = hsv_mask | ycrcb_mask
    
    filtered = pixels_bgr[combined_mask]
    
    # If too aggressive, fall back to original
    if len(filtered) < len(pixels_bgr) * 0.3:
        return pixels_bgr
    
    return filtered


def find_dominant_color_improved(pixels_bgr: np.ndarray, k: int = 5) -> tuple:
    """
    Improved K-means clustering with outlier removal.
    Returns (dominant_color, confidence_score)
    """
    if len(pixels_bgr) < k:
        mean_color = np.mean(pixels_bgr, axis=0).astype(np.uint8) if len(pixels_bgr) > 0 else np.array([180, 160, 140], dtype=np.uint8)
        return mean_color, 50.0

    # Remove outliers using percentile filtering
    pixels_float = pixels_bgr.astype(np.float32)
    
    # Calculate per-channel percentiles
    lower_percentile = np.percentile(pixels_float, 5, axis=0)
    upper_percentile = np.percentile(pixels_float, 95, axis=0)
    
    # Filter outliers
    mask = np.all((pixels_float >= lower_percentile) & (pixels_float <= upper_percentile), axis=1)
    filtered_pixels = pixels_float[mask]
    
    if len(filtered_pixels) < k:
        filtered_pixels = pixels_float

    # K-means clustering
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, 0.1)
    _, labels, centers = cv2.kmeans(filtered_pixels, k, None, criteria, 10, cv2.KMEANS_PP_CENTERS)

    # Find the largest cluster
    unique, counts = np.unique(labels, return_counts=True)
    dominant_idx = unique[np.argmax(counts)]
    dominant_color = centers[dominant_idx].astype(np.uint8)
    
    # Calculate confidence based on cluster size
    cluster_ratio = np.max(counts) / len(labels)
    confidence = min(100, cluster_ratio * 150)  # Scale to 0-100

    return dominant_color, confidence


def bgr_to_lab(bgr: np.ndarray) -> np.ndarray:
    """Convert BGR to LAB color space."""
    pixel = np.uint8([[bgr]])
    lab = cv2.cvtColor(pixel, cv2.COLOR_BGR2LAB)
    return lab[0][0].astype(np.float64)


def color_distance_lab(lab1: np.ndarray, lab2: np.ndarray) -> float:
    """Calculate Delta E (CIE76) color difference."""
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(lab1, lab2)))


def classify_undertone_enhanced(bgr_color: np.ndarray) -> tuple:
    """
    Enhanced undertone classification using multiple methods.
    Returns (undertone, confidence)
    """
    pixel = np.uint8([[bgr_color]])
    hsv = cv2.cvtColor(pixel, cv2.COLOR_BGR2HSV)[0][0]
    hue = hsv[0]
    saturation = hsv[1]
    
    b, g, r = int(bgr_color[0]), int(bgr_color[1]), int(bgr_color[2])
    
    warm_score = 0
    cool_score = 0
    
    # Hue analysis (more nuanced)
    if 15 <= hue <= 35:  # Yellow-orange range
        warm_score += 3
    elif hue < 10:  # Red range
        cool_score += 2
    elif hue > 160:  # Pink range
        cool_score += 3
    else:
        warm_score += 1
        cool_score += 1
    
    # RGB ratio analysis
    if r > 0 and g > 0:
        rg_ratio = r / g
        if rg_ratio < 1.1:  # More yellow
            warm_score += 2
        elif rg_ratio > 1.25:  # More pink/red
            cool_score += 2
    
    if r > 0 and b > 0:
        rb_ratio = r / b
        if rb_ratio > 1.3:  # Less blue
            warm_score += 1
        elif rb_ratio < 1.15:  # More blue
            cool_score += 1
    
    # Saturation consideration
    if saturation < 30:  # Low saturation = neutral
        neutral_boost = 2
    else:
        neutral_boost = 0
    
    total_score = warm_score + cool_score + neutral_boost
    
    if warm_score > cool_score + 2:
        undertone = "Warm"
        confidence = min(100, (warm_score / total_score) * 100)
    elif cool_score > warm_score + 2:
        undertone = "Cool"
        confidence = min(100, (cool_score / total_score) * 100)
    else:
        undertone = "Neutral"
        confidence = min(100, 70 + neutral_boost * 10)
    
    return undertone, confidence


def match_shade_enhanced(bgr_color: np.ndarray) -> dict:
    """Enhanced shade matching with better confidence calculation."""
    detected_lab = bgr_to_lab(bgr_color)

    best_match = None
    best_distance = float("inf")
    all_distances = []

    for shade in SHADE_DATABASE:
        shade_bgr = np.array(shade["rgb"][::-1], dtype=np.uint8)
        shade_lab = bgr_to_lab(shade_bgr)
        distance = color_distance_lab(detected_lab, shade_lab)
        all_distances.append(distance)

        if distance < best_distance:
            best_distance = distance
            best_match = shade

    # Improved confidence calculation
    max_good_distance = 35.0
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
        "colorDistance": round(best_distance, 2),
    }


@app.route("/api/analyze-skin", methods=["POST"])
def analyze_skin():
    """Enhanced skin analysis endpoint with better accuracy."""
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        # 1. Decode image
        image = decode_base64_image(data["image"])
        print(f"[INFO] Image decoded: {image.shape}")

        # 2. Detect face
        face_rect = detect_face(image)
        if face_rect is None:
            return jsonify({
                "error": "No face detected. Please ensure your face is clearly visible with good lighting."
            }), 400

        x, y, w, h = face_rect
        print(f"[INFO] Face detected at: ({x}, {y}, {w}, {h})")

        # 3. Extract skin regions with debug image
        skin_pixels, debug_img = extract_skin_regions_enhanced(image, face_rect)
        if len(skin_pixels) == 0:
            return jsonify({
                "error": "Could not extract skin region. Please try a clearer photo."
            }), 400

        print(f"[INFO] Extracted {len(skin_pixels)} skin pixels")

        # 4. Apply multi-color-space filtering
        filtered_pixels = apply_multi_color_space_filter(skin_pixels)
        if len(filtered_pixels) < 50:
            filtered_pixels = skin_pixels
        
        print(f"[INFO] Filtered to {len(filtered_pixels)} skin-tone pixels")

        # 5. Find dominant color with improved clustering
        dominant_bgr, cluster_confidence = find_dominant_color_improved(filtered_pixels, k=5)

        # Convert to RGB
        dominant_rgb = (int(dominant_bgr[2]), int(dominant_bgr[1]), int(dominant_bgr[0]))
        dominant_hex = "#{:02x}{:02x}{:02x}".format(*dominant_rgb)
        
        print(f"[INFO] Dominant color: {dominant_hex}")

        # 6. Classify undertone
        undertone, undertone_confidence = classify_undertone_enhanced(dominant_bgr)
        print(f"[INFO] Undertone: {undertone} ({undertone_confidence:.1f}% confidence)")

        # 7. Match to shade database
        shade_result = match_shade_enhanced(dominant_bgr)
        best_match = shade_result["bestMatch"]
        
        print(f"[INFO] Best match: {best_match['name']} (distance: {shade_result['colorDistance']})")

        # 8. Calculate overall confidence
        overall_confidence = (
            shade_result["confidence"] * 0.5 +
            cluster_confidence * 0.3 +
            undertone_confidence * 0.2
        )

        # 9. Get recommendations
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
            "undertoneConfidence": round(undertone_confidence, 1),
            "shadeMatch": {
                "code": best_match["code"],
                "name": best_match["name"],
                "category": best_match["category"],
                "hex": best_match["hex"],
                "undertone": best_match["undertone"],
                "description": best_match["description"],
            },
            "confidence": round(overall_confidence, 1),
            "colorDistance": shade_result["colorDistance"],
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

        # Log to MongoDB with enhanced training data
        if requests_collection is not None:
            try:
                import uuid
                log_entry = {
                    "timestamp": datetime.now(timezone.utc),
                    "sessionId": str(uuid.uuid4()),
                    
                    "detectedSkinData": {
                        "dominantColor": {
                            "rgb": list(dominant_rgb),
                            "hex": dominant_hex,
                        },
                        "skinTone": best_match["category"],
                        "undertone": undertone,
                        "undertoneConfidence": round(undertone_confidence, 1),
                    },
                    
                    "analysisMetrics": {
                        "faceDetected": {
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "pixelsAnalyzed": len(skin_pixels),
                        "pixelsFiltered": len(filtered_pixels),
                        "clusterConfidence": round(cluster_confidence, 1),
                        "colorDistance": shade_result["colorDistance"],
                    },
                    
                    "matchResult": {
                        "shadeCode": best_match["code"],
                        "shadeName": best_match["name"],
                        "category": best_match["category"],
                        "hex": best_match["hex"],
                        "undertone": best_match["undertone"],
                        "matchConfidence": round(overall_confidence, 1),
                        "nearbyMatches": [
                            {
                                "shadeCode": nearby["code"],
                                "shadeName": nearby["name"],
                                "distance": nearby["distance"],
                            }
                            for nearby in shade_result["nearbyShades"]
                        ],
                    },
                    
                    "recommendations": [
                        {
                            "productType": rec["productType"],
                            "reason": rec["reason"],
                            "category": category,
                        }
                        for rec in recommendations
                    ],
                    
                    "userContext": {
                        "userAgent": request.headers.get("User-Agent", "unknown"),
                    },
                    
                    "feedbackData": {
                        "userConfirmed": None,
                        "userFeedback": None,
                        "actualShadeUsed": None,
                    },
                }
                requests_collection.insert_one(log_entry)
            except Exception as log_err:
                print(f"[WARN] Failed to log to MongoDB: {log_err}")

        return jsonify(response)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    mongo_status = "connected" if requests_collection is not None else "unavailable"
    return jsonify({
        "status": "ok",
        "service": "Lumina Beauty - Google AI Studio Skin Analyzer (Enhanced)",
        "mongo": mongo_status,
        "opencv_version": cv2.__version__
    })


if __name__ == "__main__":
    print("=" * 60)
    print("Lumina Skin Analyzer Backend (Enhanced Version)")
    print("=" * 60)
    print(f"OpenCV Version: {cv2.__version__}")
    print(f"API Endpoint: http://localhost:5000/api/analyze-skin")
    print(f"Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
