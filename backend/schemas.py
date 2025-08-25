from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    id: int
    is_admin: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Library item schemas
class LibraryItemBase(BaseModel):
    title: str
    author: str
    type: str
    category: str
    description: str
    is_free: bool
    price: Optional[float] = None
    access_code: Optional[str] = None
    preview_content: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None

class LibraryItemCreate(LibraryItemBase):
    pass

class LibraryItemUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    is_free: Optional[bool] = None
    price: Optional[float] = None
    access_code: Optional[str] = None
    preview_content: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None

class LibraryItem(LibraryItemBase):
    id: int
    author_id: int
    cover_image: Optional[str] = None
    rating: float
    downloads: int
    views: int
    publish_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Prayer request schemas
class PrayerRequestBase(BaseModel):
    title: str
    description: str
    is_private: bool = True

class PrayerRequestCreate(PrayerRequestBase):
    pass

class PrayerRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_private: Optional[bool] = None
    status: Optional[str] = None

class PrayerRequest(PrayerRequestBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
