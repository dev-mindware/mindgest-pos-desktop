# mind-microservice/main.py

import uvicorn
from fastapi import FastAPI, BackgroundTasks, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import os
import sys

# Ensure Python can find the app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.modules.common.logger import get_logger, setup_logging
from app.modules.ai.recommender import recommender
from app.modules.ai.fraud_detection import fraud_detector
from app.modules.ai.pricing_engine import pricing_engine
from app.modules.ai.assistant import assistant_engine

# Setup logging
setup_logging()
logger = get_logger(__name__)

app = FastAPI(
    title="Mindgest POS - Mind AI Microservice",
    description="Dedicated intelligence layer for Retail POS (Dynamic Pricing, Recommendations, Fraud Detection)",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to POS Frontend domain/port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Requests & Responses ---

class RecommendRequest(BaseModel):
    cartItems: List[str]
    maxRecommendations: int = 3

class RecommendResponse(BaseModel):
    recommendations: List[str]

class FraudCheckRequest(BaseModel):
    eventType: str
    thresholdPeople: int = 2

class FraudCheckResponse(BaseModel):
    alert: bool
    message: str
    snapshot: Optional[str] = None

class TrainRequest(BaseModel):
    invoices: List[dict]

class PricingToggleRequest(BaseModel):
    enabled: bool

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- AI Endpoints ---

@app.post("/api/ai/recommend", response_model=RecommendResponse)
async def get_recommendations(request: RecommendRequest):
    """
    Get product recommendations based on the current cart items.
    Requires background training to have been executed.
    """
    try:
        recs = recommender.get_recommendations(
            current_cart_items=request.cartItems,
            max_recommendations=request.maxRecommendations
        )
        return RecommendResponse(recommendations=recs)
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}", exc_info=True)
        return RecommendResponse(recommendations=[])

@app.post("/api/ai/train")
async def train_recommendation_model(request: TrainRequest, background_tasks: BackgroundTasks):
    """
    Trigger the Apriori model training using provided sales history.
    """
    def train_task():
        success = recommender.train_model(request.invoices)
        if success:
            logger.info("Background model training completed successfully.")
        else:
            logger.info("Background model training finished, but no rules were generated or an error occurred.")

    background_tasks.add_task(train_task)
    return {"status": "Training started in the background"}

@app.post("/api/ai/fraud-check", response_model=FraudCheckResponse)
async def check_fraud_event(request: FraudCheckRequest, background_tasks: BackgroundTasks):
    """
    Trigger computer vision capture to analyze number of people during a critical POS event using YOLOv8n.
    Returns whether an alert should be raised locally on the Next.js frontend.
    """
    try:
        alert, message, snapshot = fraud_detector.analyze_event(
            event_type=request.eventType,
            threshold_people=request.thresholdPeople
        )
        return FraudCheckResponse(alert=alert, message=message, snapshot=snapshot)
    except Exception as e:
        logger.error(f"Error checking fraud event: {str(e)}", exc_info=True)
        # Fail open typically for POS (don't block the UI if the cam fails)
        return FraudCheckResponse(alert=False, message="Falha no sistema de deteção")

@app.post("/api/ai/pricing/recalculate")
async def force_price_recalculation(background_tasks: BackgroundTasks):
    """
    Manually triggers the dynamic pricing engine to iterate over the SQLite product cache, 
    recalculating and updating local prices based on Time-to-Close, Stock, Expiry Date and Local Sensitivity.
    """
    def recalculate_task():
        pricing_engine.recalculate_prices()

    background_tasks.add_task(recalculate_task)
    return {"status": "Pricing Recalculation started in the background"}

@app.post("/api/ai/pricing/toggle")
async def toggle_pricing_engine(request: PricingToggleRequest):
    """
    Toggle to enable or disable the whole MIND Dynamic Pricing feature.
    """
    pricing_engine.is_enabled = request.enabled
    
    # If disabled, we probably want to revert prices
    # For now, Nextron handles fallback if we notify it or just not update prices 
    status_str = "Enabled" if request.enabled else "Disabled"
    logger.info(f"Mind Pricing Engine is now {status_str}")
    
    return {"status": "success", "engine_enabled": pricing_engine.is_enabled}

@app.post("/api/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    Endpoint for the Mind Assistant UI to ask questions about the POS software.
    """
    try:
        reply = await assistant_engine.get_response(request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error from AI Engine")

@app.get("/")
async def root():
    """Root endpoint for health checks."""
    return {"message": "Mindgest POS - Mind AI Microservice is running!"}

if __name__ == "__main__":
    import uvicorn
    # Using Port 5001 for Mind Microservice to isolate from Port 5000 (Python PDF/SAFT microservice)
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
