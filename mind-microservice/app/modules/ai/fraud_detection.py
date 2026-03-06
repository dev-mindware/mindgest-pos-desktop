import cv2
import os
import base64
from ultralytics import YOLO
from app.modules.common.logger import get_logger
from datetime import datetime

logger = get_logger(__name__)

class FraudDetectionEngine:
    def __init__(self):
        # We use YOLOv8 nano for speed
        model_path = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
        # Ultralytics auto-downloads the model if not present when passing 'yolov8n.pt'
        try:
            self.model = YOLO('yolov8n.pt') 
        except Exception as e:
            logger.error(f"Error loading YOLOv8n model: {e}")
            self.model = None

        self.snapshots_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "temp", "fraud_snapshots")
        os.makedirs(self.snapshots_dir, exist_ok=True)

    def analyze_event(self, event_type: str, threshold_people: int = 2):
        """
        Captures 3 frames from the default webcam, runs person detection.
        If the number of people detected is less than the threshold (e.g., only 1 person during a critical event),
        it flags it as a potential fraud/inconsistency.
        Returns: alert (bool), message, snapshot (base64 compressed)
        """
        logger.info(f"Triggered fraud analysis for event: {event_type}")
        if self.model is None:
            return False, "Modelo YOLOv8n não carregado", None

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            logger.error("Failed to open webcam.")
            return False, "Erro ao acessar a webcam", None

        frames = []
        # Capture 3 frames to ensure stability
        for _ in range(3):
            ret, frame = cap.read()
            if ret:
                frames.append(frame)
            # small delay could be added here if needed, but for instantaneous capture 3 rapid frames are fine.

        cap.release()

        if not frames:
             return False, "Nenhum frame capturado", None

        # Analyze the best/last frame
        best_frame = frames[-1]
        
        # Run inference
        results = self.model(best_frame, classes=[0], verbose=False) # class 0 is 'person'
        
        num_people = 0
        annotated_frame = best_frame
        
        for result in results:
            num_people += len(result.boxes)
            annotated_frame = result.plot() # Draws bounding boxes

        alert = False
        message = f"Pessoas detectadas: {num_people}."

        # If only the operator is present (1 person) during a critical transaction
        if num_people < threshold_people:
            alert = True
            message += f" ALERTA: Número inconsistente de pessoas para o evento '{event_type}'."

        # Compress and save snapshot if alert
        snapshot_b64 = None
        if alert:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filepath = os.path.join(self.snapshots_dir, f"alert_{event_type}_{timestamp}.jpg")
            
            # Save compressed
            cv2.imwrite(filepath, annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
            logger.warning(f"Fraud alert saved to {filepath}")
            
            # Convert to base64 to return to frontend if needed
            _, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 50])
            snapshot_b64 = base64.b64encode(buffer).decode('utf-8')

        return alert, message, snapshot_b64

fraud_detector = FraudDetectionEngine()
