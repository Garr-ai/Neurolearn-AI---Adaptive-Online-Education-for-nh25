"""
Pydantic models for API requests/responses
"""
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class EventCreate(BaseModel):
    mode: str  # meeting, study, lecture, background
    focus_score: float
    load_score: float
    anomaly_score: float
    context: Dict  # { tab, url, calendar_event_id }
    user_id: Optional[str] = "default"

class EventResponse(BaseModel):
    id: int
    timestamp: datetime
    mode: str
    focus_score: float
    load_score: float
    anomaly_score: float
    context: Dict
    user_id: str
    
    class Config:
        from_attributes = True

