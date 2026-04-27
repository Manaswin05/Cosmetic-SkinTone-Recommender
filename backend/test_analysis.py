"""
Test script for skin analysis backend.
Tests the API with a sample image or webcam capture.
"""

import base64
import requests
import cv2
import sys

def test_with_webcam():
    """Capture an image from webcam and test the API."""
    print("Opening webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("ERROR: Could not open webcam")
        return
    
    print("Press SPACE to capture, ESC to quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("ERROR: Failed to capture frame")
            break
        
        cv2.imshow('Webcam - Press SPACE to capture', frame)
        
        key = cv2.waitKey(1)
        if key == 27:  # ESC
            break
        elif key == 32:  # SPACE
            print("Capturing image...")
            
            # Encode image to base64
            _, buffer = cv2.imencode('.jpg', frame)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            img_data_url = f"data:image/jpeg;base64,{img_base64}"
            
            # Send to API
            print("Sending to API...")
            try:
                response = requests.post(
                    "http://localhost:5000/api/analyze-skin",
                    json={"image": img_data_url},
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    print("\n" + "="*60)
                    print("ANALYSIS RESULTS")
                    print("="*60)
                    print(f"Detected Color: {result['detectedColor']['hex']}")
                    print(f"Shade Match: {result['shadeMatch']['name']} ({result['shadeMatch']['code']})")
                    print(f"Category: {result['shadeMatch']['category']}")
                    print(f"Undertone: {result['undertone']}")
                    print(f"Confidence: {result['confidence']}%")
                    print(f"Description: {result['shadeMatch']['description']}")
                    print("\nNearby Shades:")
                    for shade in result['nearbyShades']:
                        print(f"  - {shade['name']} ({shade['code']}): {shade['hex']}")
                    print("="*60)
                else:
                    print(f"ERROR: {response.status_code}")
                    print(response.json())
            except Exception as e:
                print(f"ERROR: {e}")
            
            break
    
    cap.release()
    cv2.destroyAllWindows()


def test_with_file(image_path):
    """Test the API with an image file."""
    print(f"Loading image: {image_path}")
    
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"ERROR: Could not load image from {image_path}")
        return
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', image)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    img_data_url = f"data:image/jpeg;base64,{img_base64}"
    
    # Send to API
    print("Sending to API...")
    try:
        response = requests.post(
            "http://localhost:5000/api/analyze-skin",
            json={"image": img_data_url},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("\n" + "="*60)
            print("ANALYSIS RESULTS")
            print("="*60)
            print(f"Detected Color: {result['detectedColor']['hex']}")
            print(f"Shade Match: {result['shadeMatch']['name']} ({result['shadeMatch']['code']})")
            print(f"Category: {result['shadeMatch']['category']}")
            print(f"Undertone: {result['undertone']}")
            print(f"Confidence: {result['confidence']}%")
            print(f"Description: {result['shadeMatch']['description']}")
            print("\nNearby Shades:")
            for shade in result['nearbyShades']:
                print(f"  - {shade['name']} ({shade['code']}): {shade['hex']}")
            print("\nRecommendations:")
            for rec in result['recommendations']:
                print(f"  - {rec['productType']}: {rec['reason']}")
            print("="*60)
        else:
            print(f"ERROR: {response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test with file
        test_with_file(sys.argv[1])
    else:
        # Test with webcam
        test_with_webcam()
