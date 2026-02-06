# realtimedetection.py
# For M2 Mac - Fixed version with TensorFlow 2.16+ compatibility

import os
import multiprocessing as mp

# macOS / M1/M2 fixes
os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
mp.set_start_method("spawn", force=True)

import cv2
import numpy as np

# Try to import TensorFlow with error handling
try:
    import tensorflow as tf
    print(f"✅ TensorFlow version: {tf.__version__}")
    
    # Check if Metal is being used
    physical_devices = tf.config.list_physical_devices('GPU')
    if physical_devices:
        print("✅ Using Apple Metal GPU acceleration")
        for device in physical_devices:
            print(f"   GPU Device: {device}")
    else:
        print("⚠️ Running on CPU")
        
except ImportError:
    print("❌ TensorFlow not installed. Please run:")
    print("   pip install tensorflow-macos tensorflow-metal")
    exit(1)

# ---- Load Model with improved compatibility ----
def load_model_safe():
    """Load model with fallback methods for different TensorFlow versions"""
    try:
        # Method 1: Try direct loading (works for newer models)
        print("🔄 Attempting to load model directly...")
        model = tf.keras.models.load_model("facialemotionmodel.h5", compile=False)
        print("✅ Model loaded successfully using direct method!")
        return model
    except Exception as e1:
        print(f"⚠️ Direct loading failed: {e1}")
        
        try:
            # Method 2: Load from JSON + weights (your current approach with fixes)
            print("🔄 Attempting to load model from JSON + weights...")
            
            with open("facialemotionmodel.json", "r") as json_file:
                model_json = json_file.read()
            
            # Try different approaches for model_from_json
            try:
                model = tf.keras.models.model_from_json(model_json)
            except Exception:
                # Fallback: manually parse and rebuild
                import json
                config = json.loads(model_json)
                model = tf.keras.models.Model.from_config(config)
            
            # Load weights
            model.load_weights("facialemotionmodel.h5")
            print("✅ Model loaded successfully using JSON method!")
            return model
            
        except Exception as e2:
            print(f"⚠️ JSON loading failed: {e2}")
            
            try:
                # Method 3: Try loading with custom objects cleared
                print("🔄 Attempting to load with cleared custom objects...")
                tf.keras.utils.get_custom_objects().clear()
                
                with open("facialemotionmodel.json", "r") as json_file:
                    model_json = json_file.read()
                
                model = tf.keras.models.model_from_json(model_json)
                model.load_weights("facialemotionmodel.h5")
                print("✅ Model loaded successfully with cleared objects!")
                return model
                
            except Exception as e3:
                print(f"❌ All loading methods failed:")
                print(f"   Method 1: {e1}")
                print(f"   Method 2: {e2}")
                print(f"   Method 3: {e3}")
                print("\n💡 Suggestions:")
                print("   1. Try recreating the model with current TensorFlow version")
                print("   2. Check if model files are corrupted")
                print("   3. Consider using SavedModel format instead of h5")
                return None

# Load the model
model = load_model_safe()
if model is None:
    exit(1)

# Compile the model for predictions (required for some versions)
try:
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
except Exception as e:
    print(f"⚠️ Could not compile model: {e}")
    print("   Continuing without compilation...")

# Haar Cascade for face detection
haar_file = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
try:
    face_cascade = cv2.CascadeClassifier(haar_file)
    if face_cascade.empty():
        raise Exception("Could not load Haar cascade")
    print("✅ Haar cascade loaded successfully!")
except Exception as e:
    print(f"❌ Error loading Haar cascade: {e}")
    exit(1)

def extract_features(image):
    """Extract and normalize features from face image"""
    feature = np.array(image)
    feature = feature.reshape(1, 48, 48, 1)
    return feature / 255.0

# Emotion labels
labels = {
    0: "angry",
    1: "disgust", 
    2: "fear",
    3: "happy",
    4: "neutral",
    5: "sad",
    6: "surprise"
}

# Color mapping for different emotions
emotion_colors = {
    "angry": (0, 0, 255),      # Red
    "disgust": (0, 102, 0),    # Dark Green
    "fear": (102, 0, 102),     # Purple
    "happy": (0, 255, 255),    # Yellow
    "neutral": (200, 200, 200),# Light Gray
    "sad": (255, 0, 0),        # Blue
    "surprise": (0, 165, 255)  # Orange
}

# ---- Webcam Setup ----
try:
    webcam = cv2.VideoCapture(0)
    if not webcam.isOpened():
        raise Exception("Could not access webcam")
    
    # Set camera properties for better performance
    webcam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    webcam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    webcam.set(cv2.CAP_PROP_FPS, 30)
    
    print("✅ Webcam initialized successfully!")
    
except Exception as e:
    print(f"❌ Error accessing webcam: {e}")
    exit(1)

print("\n🎥 Starting real-time emotion detection. Press 'q' to quit.")
print("📝 Make sure your face is well-lit and clearly visible to the camera.")

# For FPS calculation
fps = 0
frame_count = 0
start_time = cv2.getTickCount()

try:
    while True:
        ret, im = webcam.read()
        if not ret:
            print("⚠️ Could not read frame from webcam")
            break

        # Calculate FPS
        frame_count += 1
        if frame_count >= 30:
            end_time = cv2.getTickCount()
            fps = frame_count / ((end_time - start_time) / cv2.getTickFrequency())
            start_time = end_time
            frame_count = 0

        gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        
        # Detect faces with optimized parameters
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )

        for (p, q, r, s) in faces:
            # Extract the face ROI
            face_roi = gray[q:q+s, p:p+r]
            
            # Draw rectangle around face
            cv2.rectangle(im, (p, q), (p+r, q+s), (255, 0, 0), 2)

            try:
                # Resize and preprocess the face image
                image = cv2.resize(face_roi, (48, 48))
                img = extract_features(image)
                
                # Predict emotion with error handling
                pred = model.predict(img, verbose=0)
                
                # Handle different prediction formats
                if len(pred.shape) > 1 and pred.shape[0] == 1:
                    pred = pred[0]
                
                prediction_label = labels[np.argmax(pred)]
                confidence = np.max(pred) * 100
                
                # Get color for this emotion
                color = emotion_colors.get(prediction_label, (0, 0, 255))
                
                # Display emotion and confidence
                label_text = f"{prediction_label} ({confidence:.1f}%)"
                cv2.putText(im, label_text, (p, q-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                            
            except Exception as e:
                print(f"⚠️ Error processing face: {e}")
                # Draw a simple label indicating processing error
                cv2.putText(im, "Processing error", (p, q-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
                continue

        # Display FPS and instructions
        cv2.putText(im, f"FPS: {fps:.1f}", (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(im, "Press 'q' to quit", (10, im.shape[0] - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        cv2.imshow("Facial Emotion Detection", im)

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

except KeyboardInterrupt:
    print("\n🛑 Interrupted by user")

except Exception as e:
    print(f"❌ Unexpected error: {e}")

finally:
    # Cleanup
    webcam.release()
    cv2.destroyAllWindows()
    print("✅ Application closed successfully.")

print("\n📋 If you continue having issues, try:")
print("   1. Update TensorFlow: pip install --upgrade tensorflow-macos tensorflow-metal")  
print("   2. Recreate your model with the current TensorFlow version")
print("   3. Use SavedModel format instead of h5 for better compatibility")