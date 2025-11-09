"""
Database models and setup for NeuroCalm events
"""
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class Event(Base):
    """Event model matching the specified schema"""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    mode = Column(String, index=True)  # meeting, study, lecture, background
    focus_score = Column(Float)
    load_score = Column(Float)
    anomaly_score = Column(Float)
    context = Column(JSON)  # { tab, url, calendar_event_id }
    user_id = Column(String, default="default", index=True)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./neurocalm.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

