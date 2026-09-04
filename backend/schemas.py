from pydantic import BaseModel, ConfigDict, Field, computed_field
from typing import List, Optional
from datetime import datetime

class BaseDBModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int

    @computed_field
    @property
    def _id(self) -> str:
        return str(self.id)

# --- CAMPAIGN SCHEMAS ---
class CampaignBase(BaseModel):
    name: str
    objective: str
    status: Optional[str] = "Active"
    budget: float
    roi: Optional[float] = 0.0
    startDate: str
    endDate: str
    channels: Optional[List[str]] = []

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    objective: Optional[str] = None
    status: Optional[str] = None
    budget: Optional[float] = None
    roi: Optional[float] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    channels: Optional[List[str]] = None

class CampaignResponse(CampaignBase, BaseDBModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

# --- POST SCHEMAS ---
class PostBase(BaseModel):
    title: str
    platform: str
    content: str
    imageUrl: Optional[str] = ""

class PostCreate(PostBase):
    pass

class PostResponse(PostBase, BaseDBModel):
    publishedAt: Optional[datetime] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

# --- PROFILE SCHEMAS ---
class ProfileBase(BaseModel):
    name: str
    email: str
    company: str
    phone: Optional[str] = ""
    industry: Optional[str] = ""
    avatar: Optional[str] = ""

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    avatar: Optional[str] = None

class ProfileResponse(ProfileBase, BaseDBModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

# --- NOTIFICATION SCHEMAS ---
class NotificationBase(BaseModel):
    title: str
    text: str
    type: Optional[str] = "info"
    unread: Optional[bool] = True

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase, BaseDBModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

# --- HISTORY SCHEMAS ---
class HistoryBase(BaseModel):
    action: str
    category: str
    details: str

class HistoryCreate(HistoryBase):
    pass

class HistoryResponse(HistoryBase, BaseDBModel):
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

# --- AI GENERATION REQUEST SCHEMAS ---
class AIPostRequest(BaseModel):
    title: str
    platform: str
    theme: Optional[str] = ""

class AIBatchRequest(BaseModel):
    summary: str
