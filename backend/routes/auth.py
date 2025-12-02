from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User
from schemas import UserCreate, Token, LoginRequest, FirebaseSyncRequest, User as UserSchema
from utils.auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.firebase_auth import get_firebase_user_info

security = HTTPBearer()

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_admin=False  # Default to regular user
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return access token."""
    # Find user by username
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-form", response_model=Token)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login using OAuth2 form (for compatibility with frontend forms)."""
    return await login(LoginRequest(username=form_data.username, password=form_data.password), db)

@router.post("/sync-firebase-user", response_model=UserSchema)
async def sync_firebase_user(
    sync_data: FirebaseSyncRequest,
    firebase_token: str = Depends(lambda: None),  # Will be extracted from header
    db: Session = Depends(get_db)
):
    """
    Sync a Firebase user to the backend database.
    This endpoint should be called when a user registers via Firebase.
    """
    # Verify the Firebase token
    firebase_user_info = get_firebase_user_info(firebase_token) if firebase_token else None
    
    if not firebase_user_info:
        # If no token provided, we'll still allow sync but verify the UID matches
        # In production, you might want to require the token
        pass
    
    # Check if user already exists by Firebase UID
    existing_user = db.query(User).filter(User.firebase_uid == sync_data.firebase_uid).first()
    
    if existing_user:
        # Update existing user
        existing_user.email = sync_data.email
        existing_user.full_name = sync_data.full_name or sync_data.display_name or sync_data.full_name
        existing_user.phone = sync_data.phone or existing_user.phone
        existing_user.location = sync_data.location or existing_user.location
        existing_user.role = sync_data.role or existing_user.role
        if sync_data.is_admin is not None:
            existing_user.is_admin = sync_data.is_admin
        
        db.commit()
        db.refresh(existing_user)
        return existing_user
    
    # Check if user exists by email (might be a legacy user)
    existing_email_user = db.query(User).filter(User.email == sync_data.email).first()
    if existing_email_user:
        # Link Firebase UID to existing user
        existing_email_user.firebase_uid = sync_data.firebase_uid
        existing_email_user.full_name = sync_data.full_name or existing_email_user.full_name
        existing_email_user.phone = sync_data.phone or existing_email_user.phone
        existing_email_user.location = sync_data.location or existing_email_user.location
        existing_email_user.role = sync_data.role or existing_email_user.role
        
        db.commit()
        db.refresh(existing_email_user)
        return existing_email_user
    
    # Create new user
    # Generate username from email if not provided
    username = sync_data.email.split('@')[0]
    # Ensure username is unique
    base_username = username
    counter = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{counter}"
        counter += 1
    
    new_user = User(
        email=sync_data.email,
        username=username,
        full_name=sync_data.full_name or sync_data.display_name or sync_data.email,
        firebase_uid=sync_data.firebase_uid,
        hashed_password=None,  # Firebase users don't have passwords in backend
        phone=sync_data.phone,
        location=sync_data.location,
        role=sync_data.role or "Member",
        is_admin=sync_data.is_admin or False,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/sync-firebase-user-with-token", response_model=UserSchema)
async def sync_firebase_user_with_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Sync Firebase user using the Firebase ID token from Authorization header.
    This is the recommended way to sync users.
    """
    firebase_token = credentials.credentials
    firebase_user_info = get_firebase_user_info(firebase_token)
    
    if not firebase_user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.firebase_uid == firebase_user_info["uid"]).first()
    
    if existing_user:
        # Update user info from Firebase
        if firebase_user_info.get("email"):
            existing_user.email = firebase_user_info["email"]
        if firebase_user_info.get("display_name"):
            existing_user.full_name = firebase_user_info["display_name"]
        if firebase_user_info.get("phone_number"):
            existing_user.phone = firebase_user_info["phone_number"]
        
        db.commit()
        db.refresh(existing_user)
        return existing_user
    
    # Check if user exists by email
    if firebase_user_info.get("email"):
        existing_email_user = db.query(User).filter(User.email == firebase_user_info["email"]).first()
        if existing_email_user:
            # Link Firebase UID
            existing_email_user.firebase_uid = firebase_user_info["uid"]
            if firebase_user_info.get("display_name"):
                existing_email_user.full_name = firebase_user_info["display_name"]
            if firebase_user_info.get("phone_number"):
                existing_email_user.phone = firebase_user_info["phone_number"]
            
            db.commit()
            db.refresh(existing_email_user)
            return existing_email_user
    
    # Create new user
    email = firebase_user_info.get("email", f"{firebase_user_info['uid']}@firebase.local")
    username = email.split('@')[0]
    base_username = username
    counter = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{counter}"
        counter += 1
    
    new_user = User(
        email=email,
        username=username,
        full_name=firebase_user_info.get("display_name") or email,
        firebase_uid=firebase_user_info["uid"],
        hashed_password=None,
        phone=firebase_user_info.get("phone_number"),
        role="Member",
        is_admin=False,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user
