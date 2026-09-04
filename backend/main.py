import os
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx
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
        # 1. Seed Campaigns
        if db.query(models.Campaign).count() == 0:
            default_campaigns = [
                models.Campaign(
                    name="Summer Fitness Kickoff",
                    objective="Lead Generation",
                    status="Active",
                    budget=4500.0,
                    roi=380.0,
                    startDate="2026-06-01",
                    endDate="2026-08-31",
                    channels=["Instagram", "Facebook"]
                ),
                models.Campaign(
                    name="SaaS Automations Launch",
                    objective="Sales / Conversion",
                    status="Active",
                    budget=12000.0,
                    roi=490.0,
                    startDate="2026-05-15",
                    endDate="2026-09-15",
                    channels=["LinkedIn", "Email"]
                ),
                models.Campaign(
                    name="Eco-Friendly App Promo",
                    objective="Brand Awareness",
                    status="Paused",
                    budget=3000.0,
                    roi=180.0,
                    startDate="2026-07-01",
                    endDate="2026-08-01",
                    channels=["Instagram", "Facebook", "LinkedIn"]
                ),
                models.Campaign(
                    name="Gourmet Coffee Launch",
                    objective="Sales / Conversion",
                    status="Completed",
                    budget=6500.0,
                    roi=420.0,
                    startDate="2026-04-01",
                    endDate="2026-05-30",
                    channels=["Facebook", "Instagram", "Email"]
                )
            ]
            db.add_all(default_campaigns)
            db.commit()
            print("Seeded default campaigns.")

        # 2. Seed Profile
        if db.query(models.Profile).count() == 0:
            default_profile = models.Profile(
                name="Sarah Jenkins",
                email="sarah.j@apexglobal.com",
                company="Apex Global Digital",
                phone="+1 (555) 902-3481",
                industry="Digital Agency / SaaS",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            )
            db.add(default_profile)
            db.commit()
            print("Seeded default profile.")

        # 3. Seed Notifications
        if db.query(models.Notification).count() == 0:
            default_notifs = [
                models.Notification(
                    title="Setup Completed",
                    text="Fullstack FastAPI & MySQL backend connected and running smoothly.",
                    type="success",
                    unread=True
                ),
                models.Notification(
                    title="Database Sync",
                    text="MySQL database tables initialized.",
                    type="info",
                    unread=True
                )
            ]
            db.add_all(default_notifs)
            db.commit()
            print("Seeded default notifications.")

        # 4. Seed History
        if db.query(models.History).count() == 0:
            default_history = [
                models.History(
                    action="Database Initialized",
                    category="campaign",
                    details="Created and synced campaign database with MySQL."
                ),
                models.History(
                    action="Campaign 'Summer Fitness Kickoff' Synced",
                    category="campaign",
                    details="Dynamic data binding established."
                )
            ]
            db.add_all(default_history)
            db.commit()
            print("Seeded default history logs.")

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


# --- 6. n8n AI PROXY ---
@app.post("/api/generate-ai-batch")
async def generate_ai_batch(request_data: schemas.AIBatchRequest):
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(
                N8N_BATCH_WEBHOOK_URL,
                json={"summary": request_data.summary, "mode": "batch"},
                timeout=30.0
            )
            if res.status_code != 200:
                raise HTTPException(
                    status_code=res.status_code,
                    detail=f"n8n batch webhook returned {res.status_code}"
                )
            return res.json()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"HTTP Request failed: {exc}")

@app.post("/api/generate-ai-post")
async def generate_ai_post(request_data: schemas.AIPostRequest):
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(
                N8N_WEBHOOK_URL,
                json=request_data.model_dump(),
                timeout=30.0
            )
            if res.status_code != 200:
                detail = (
                    "n8n workflow not found. Activate the workflow in n8n and set N8N_WEBHOOK_URL in backend/.env"
                    if res.status_code == 404
                    else f"n8n webhook returned {res.status_code}"
                )
                raise HTTPException(status_code=res.status_code, detail=detail)
            return res.json()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"HTTP Request failed: {exc}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
