"""
FastAPI REST API for NeuroCalm
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from backend.database import get_db, init_db, Event
from backend.models import EventCreate, EventResponse

app = FastAPI(title="NeuroCalm API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {"message": "NeuroCalm API", "version": "1.0.0"}

@app.post("/events", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """Create a new event"""
    db_event = Event(
        timestamp=datetime.utcnow(),
        mode=event.mode,
        focus_score=event.focus_score,
        load_score=event.load_score,
        anomaly_score=event.anomaly_score,
        context=event.context,
        user_id=event.user_id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.get("/events", response_model=List[EventResponse])
def get_events(
    user_id: Optional[str] = None,
    mode: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get events with optional filtering"""
    query = db.query(Event)
    
    if user_id:
        query = query.filter(Event.user_id == user_id)
    if mode:
        query = query.filter(Event.mode == mode)
    
    events = query.order_by(Event.timestamp.desc()).limit(limit).all()
    return events

@app.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    """Get list of all users"""
    users = db.query(Event.user_id).distinct().all()
    return [user[0] for user in users]

@app.get("/stats/{user_id}")
def get_user_stats(user_id: str, db: Session = Depends(get_db)):
    """Get statistics for a user"""
    events = db.query(Event).filter(Event.user_id == user_id).all()
    
    if not events:
        return {
            "user_id": user_id,
            "total_events": 0,
            "avg_focus": 0,
            "avg_load": 0,
            "avg_anomaly": 0
        }
    
    return {
        "user_id": user_id,
        "total_events": len(events),
        "avg_focus": sum(e.focus_score for e in events) / len(events),
        "avg_load": sum(e.load_score for e in events) / len(events),
        "avg_anomaly": sum(e.anomaly_score for e in events) / len(events),
        "modes": {}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

