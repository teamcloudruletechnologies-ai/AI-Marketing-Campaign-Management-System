import os
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx
from pydantic import BaseModel
from dotenv import load_dotenv

import models
import schemas
from database import engine, Base, get_db

load_dotenv()

# Webhook configuration
N8N_WEBHOOK_URL = os.getenv(
    "N8N_WEBHOOK_URL",
    "https://praveen-10.app.n8n.cloud/webhook/generate-campaign-content"
)
N8N_BATCH_WEBHOOK_URL = os.getenv("N8N_BATCH_WEBHOOK_URL", N8N_WEBHOOK_URL)


def seed_database(db: Session):
    try:
        # Profile check: only seed if no profile exists
        if db.query(models.Profile).count() == 0:
            default_profile = models.Profile(
                name="Marketing Admin",
                email="admin@aimarketing.ai",
                company="AI Marketing Suite",
                phone="+1 (555) 019-2834",
                industry="AI Marketing",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            )
            db.add(default_profile)
            db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    db = Session(bind=engine)
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="AI Marketing Campaign Management Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 1. CAMPAIGNS ---
@app.get("/api/campaigns", response_model=List[schemas.CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.id.desc()).all()

@app.post("/api/campaigns", response_model=schemas.CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    db_item = models.Campaign(**campaign.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/campaigns/{campaign_id}", response_model=schemas.CampaignResponse)
def update_campaign(campaign_id: int, campaign: schemas.CampaignUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Campaign deleted", "deleted": schemas.CampaignResponse.model_validate(db_item)}


# --- 2. POSTS ---
@app.get("/api/posts", response_model=List[schemas.PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.publishedAt.desc()).all()

@app.post("/api/posts", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    db_item = models.Post(**post.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Post deleted", "deleted": schemas.PostResponse.model_validate(db_item)}


# --- 3. PROFILE ---
@app.get("/api/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(
            name="Sarah Jenkins",
            email="sarah.j@apexglobal.com",
            company="Apex Global Digital",
            phone="",
            industry="",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/api/profile", response_model=schemas.ProfileResponse)
def update_profile(profile_data: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(**profile_data.model_dump(exclude_unset=True))
        db.add(profile)
    else:
        update_data = profile_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
            
    db.commit()
    db.refresh(profile)
    return profile


# --- 4. NOTIFICATIONS ---
@app.get("/api/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.id.desc()).limit(10).all()

@app.post("/api/notifications", response_model=schemas.NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(notif: schemas.NotificationCreate, db: Session = Depends(get_db)):
    db_item = models.Notification(**notif.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/notifications/mark-read")
def mark_all_notifications_read(db: Session = Depends(get_db)):
    db.query(models.Notification).filter(models.Notification.unread == True).update({"unread": False})
    db.commit()
    return {"message": "All notifications marked read"}

@app.put("/api/notifications/{notif_id}/read", response_model=schemas.NotificationResponse)
def mark_single_notification_read(notif_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db_item.unread = False
    db.commit()
    db.refresh(db_item)
    return db_item


# --- 5. HISTORY ---
@app.get("/api/history", response_model=List[schemas.HistoryResponse])
def get_history(db: Session = Depends(get_db)):
    return db.query(models.History).order_by(models.History.id.desc()).all()

@app.post("/api/history", response_model=schemas.HistoryResponse, status_code=status.HTTP_201_CREATED)
def create_history(history: schemas.HistoryCreate, db: Session = Depends(get_db)):
    db_item = models.History(**history.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item



# --- 6. LOGIN ---
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/login")
def login(request_data: LoginRequest):
    valid_email = os.getenv("LOGIN_EMAIL", "admin@brand.com")
    valid_password = os.getenv("LOGIN_PASSWORD", "admin123")
    if request_data.email == valid_email and request_data.password == valid_password:
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid email or password")


# --- 7. GOOGLE GEMINI AI GENERATION ---
class TextGenerateRequest(BaseModel):
    summary: str = ""
    image_base64: str | None = None
    mime_type: str = "image/jpeg"
    tone: str = "Engaging & Persuasive"

class ImageRequest(BaseModel):
    prompt: str

@app.post("/api/generate-text")
async def generate_text(request_data: TextGenerateRequest):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # Check if this is an image-to-caption request
    has_image = bool(request_data.image_base64 and len(request_data.image_base64) > 50)
    tone_hint = f" Desired tone of voice: '{request_data.tone}'." if request_data.tone else ""
    
    if has_image:
        # Clean base64 string and extract mime type if data URI
        raw_b64 = request_data.image_base64
        mime_type = request_data.mime_type or "image/jpeg"
        if raw_b64.startswith("data:"):
            try:
                header, raw_b64 = raw_b64.split(";base64,", 1)
                mime_type = header.replace("data:", "").strip()
            except Exception:
                pass
        
        user_hint = f" Context or theme: '{request_data.summary}'." if request_data.summary.strip() else ""
        prompt_text = (
            f"You are an expert social media and marketing copywriter. Carefully look at this image.{user_hint}{tone_hint} "
            f"Analyze the subjects, setting, style, colors, and product shown in this image. "
            f"Generate compelling, ready-to-post marketing captions tailored to this photo with the requested tone. "
            f"Return ONLY valid JSON with no markdown formatting and no code fences, with this exact structure: "
            f"{{\"Instagram\": \"engaging Instagram caption with emojis, storytelling hook, and 8-10 trending hashtags\", "
            f"\"Twitter\": \"catchy viral tweet with emojis and 2-3 hashtags\", "
            f"\"LinkedIn\": \"insightful professional post emphasizing quality, value, and design\", "
            f"\"EmailSubject\": \"compelling high-open-rate subject line\", "
            f"\"EmailBody\": \"<div style='font-family:sans-serif;padding:16px;'><h3>Heading</h3><p>Engaging promotional email body HTML...</p></div>\"}}"
        )
        content_parts = [
            {"text": prompt_text},
            {"inlineData": {"mimeType": mime_type, "data": raw_b64}}
        ]
    else:
        prompt_text = (
            f"You are an expert marketing copywriter. Based on this product/campaign summary: \"{request_data.summary}\".{tone_hint} "
            f"generate creative marketing content tailored to the requested tone. Return ONLY valid JSON with no markdown formatting and no code fences, with this structure: "
            f"{{\"Instagram\": \"engaging Instagram caption with emojis and hashtags\", "
            f"\"Twitter\": \"catchy tweet with emojis and hashtags\", "
            f"\"LinkedIn\": \"professional brand update with hashtags\", "
            f"\"EmailSubject\": \"compelling subject line\", "
            f"\"EmailBody\": \"<div style='font-family:sans-serif;padding:16px;'><h3>Heading</h3><p>Engaging promotional email body HTML...</p></div>\"}}"
        )
        content_parts = [{"text": prompt_text}]

    if GEMINI_API_KEY:
        for model in ["gemini-3.6-flash", "gemini-2.5-flash"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
            payload = {"contents": [{"parts": content_parts}]}
            try:
                async with httpx.AsyncClient(timeout=35.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                        raw_text = parts[0].get("text", "") if parts else ""
                        cleaned = raw_text.replace("```json", "").replace("```", "").strip()
                        import json
                        parsed = json.loads(cleaned)
                        engine_name = f"Google Gemini Vision ({model})" if has_image else f"Google Gemini ({model})"
                        return {"success": True, "data": parsed, "engine": engine_name}
                    else:
                        print(f"Gemini {model} error: {res.status_code} {res.text[:200]}")
            except Exception as e:
                print(f"Gemini {model} error:", e)

    return {"success": False, "data": None, "engine": "Fallback"}


@app.post("/api/generate-image")
async def generate_image(request_data: ImageRequest):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    # Try Gemini Flash Image models
    if GEMINI_API_KEY:
        for model in ["gemini-3.1-flash-image", "gemini-2.5-flash-image", "gemini-3-pro-image"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": request_data.prompt}]}],
                "generationConfig": {"responseModalities": ["IMAGE"]}
            }
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                        image_part = next((p for p in parts if "inlineData" in p), None)
                        if image_part:
                            mime = image_part["inlineData"]["mimeType"]
                            b64 = image_part["inlineData"]["data"]
                            return {"imageUrl": f"data:{mime};base64,{b64}", "engine": f"Google Gemini ({model})"}
                    else:
                        print(f"Gemini {model} error: {res.status_code}")
            except Exception as e:
                print(f"Gemini {model} image exception:", e)

    return {"imageUrl": None, "fallback": True, "reason": "No active Gemini image quota, using smart fallback"}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
