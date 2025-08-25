from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    library_items = relationship("LibraryItem", back_populates="author_user")

class LibraryItem(Base):
    __tablename__ = "library_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, nullable=False)  # book, blog, quotes
    category = Column(String, nullable=False)  # devotional, ministry, relationships, etc.
    description = Column(Text, nullable=False)
    cover_image = Column(String)  # File path to uploaded image
    is_free = Column(Boolean, default=True)
    price = Column(Float, nullable=True)
    access_code = Column(String, nullable=True)
    preview_content = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    tags = Column(String)  # Comma-separated tags
    rating = Column(Float, default=0.0)
    downloads = Column(Integer, default=0)
    views = Column(Integer, default=0)
    publish_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author_user = relationship("User", back_populates="library_items")

class PrayerRequest(Base):
    __tablename__ = "prayer_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    is_private = Column(Boolean, default=True)
    status = Column(String, default="pending")  # pending, answered, in_progress
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
