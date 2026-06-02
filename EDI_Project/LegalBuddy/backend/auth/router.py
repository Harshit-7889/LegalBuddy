from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict, Any
import os
import random
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

import database
from . import schemas, auth

load_dotenv()

router = APIRouter(tags=["Authentication"])

# --- Hardcoded Data & Config ---
VERIFIED_LEGAL_IDS = {"LAW12345", "JUDGE9876", "BARCOUNCIL555", "ADMIN_ID_001"}
MAIL_SERVER = os.getenv("MAIL_SERVER", "")
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")

# --- Helper Functions ---
def get_mail_config() -> ConnectionConfig:
    return ConnectionConfig(
        MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
        MAIL_FROM=os.getenv("MAIL_FROM", ""),
        MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER=os.getenv("MAIL_SERVER", ""),
        MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
        MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )

def require_role(allowed_roles: list[str]):
    def wrapper(user: Dict[str, Any] = Depends(auth.get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return wrapper

# --- Endpoints ---

@router.post("/auth/send-verification-code")
async def send_verification_code(payload: schemas.EmailRequest):
    users = database.db["users"]
    code = f"{random.randint(100000, 999999)}"
    users.update_one({"email": payload.email.lower()}, {"$set": {"email_verification_code": code}}, upsert=True)
    if MAIL_SERVER and MAIL_USERNAME:
        message = MessageSchema(subject="Your Verification Code", recipients=[payload.email], body=f"Your verification code is {code}")
        fm = FastMail(get_mail_config())
        await fm.send_message(message)
    else:
        print(f"[DEV] Verification code for {payload.email}: {code}")
    return {"status": "ok"}

@router.post("/auth/verify-email-code")
def verify_email_code(payload: schemas.VerifyEmailCodeRequest):
    users = database.db["users"]
    doc = users.find_one({"email": payload.email.lower()})
    if not doc or doc.get("email_verification_code") != payload.code:
        raise HTTPException(status_code=400, detail="Invalid code")
    users.update_one({"email": payload.email.lower()}, {"$unset": {"email_verification_code": ""}})
    return {"status": "verified"}

@router.post("/auth/register", response_model=schemas.UserPublic)
def register(user_in: schemas.UserCreate):
    users = database.db["users"]
    email = user_in.email.lower()
    if users.find_one({"email": email, "password_hash": {"$exists": True}}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role, status_val = ("user", "active")
    if user_in.legal_id_number:
        if user_in.legal_id_number in VERIFIED_LEGAL_IDS:
            role, status_val = ("lawyer", "verified")
        else:
            raise HTTPException(status_code=400, detail="The provided Legal ID Number is not valid.")
            
    hashed_password = auth.get_password_hash(user_in.password)
    update_data = {"$set": {"name": user_in.name, "password_hash": hashed_password, "role": role, "status": status_val, "legal_id_number": user_in.legal_id_number}}
    updated_user = users.find_one_and_update({"email": email}, update_data, upsert=True, return_document=True)
    return schemas.UserPublic(
        name=updated_user["name"],
        email=updated_user["email"],
        role=updated_user["role"],
        status=updated_user.get("status", "active"),
    )

@router.post("/auth/login", response_model=schemas.TokenPair)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = database.db["users"].find_one({"email": form_data.username.lower()})
    if not user or not auth.verify_password(form_data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    payload = {"sub": user["email"], "role": user.get("role", "user")}
    access_token = auth.create_access_token(payload)
    refresh_token = auth.create_refresh_token(payload)
    return schemas.TokenPair(access_token=access_token, refresh_token=refresh_token)

@router.get("/users/me", response_model=schemas.UserPublic)
def read_me(current_user: dict = Depends(auth.get_current_user)):
    user = database.db["users"].find_one({"email": current_user["sub"].lower()})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.UserPublic(
        name=user.get("name", ""),
        email=user["email"],
        role=user.get("role", "user"),
        status=user.get("status", "active"),
    )

@router.get("/admin/dashboard")
def admin_dashboard(current_user: dict = Depends(require_role(["admin"]))):
    return {"message": f"Welcome Admin {current_user['sub']}"}

# --- Missing Auth Endpoints ---

@router.post("/auth/refresh", response_model=schemas.TokenPair)
def refresh_token(current_user: dict = Depends(auth.get_current_user_from_refresh_token)):
    payload = {"sub": current_user["sub"], "role": current_user.get("role", "user")}
    access_token = auth.create_access_token(payload)
    new_refresh_token = auth.create_refresh_token(payload)
    return schemas.TokenPair(access_token=access_token, refresh_token=new_refresh_token)


@router.post("/auth/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest):
    users = database.db["users"]
    user = users.find_one({"email": payload.email.lower()})
    if user:
        reset_token = auth.create_access_token({"sub": payload.email.lower()})
        print(f"Password Reset Token for {payload.email}: {reset_token}")
    return {"message": "If a user with that email exists, a reset token has been generated."}


@router.post("/auth/reset-password")
def reset_password(payload: schemas.ResetPasswordRequest):
    try:
        payload_data = auth.jwt.decode(payload.token, auth.JWT_SECRET_KEY, algorithms=[auth.ALGORITHM])
        email = payload_data.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except auth.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    new_hashed_password = auth.get_password_hash(payload.new_password)
    database.db["users"].update_one(
        {"email": email},
        {"$set": {"password_hash": new_hashed_password}}
    )
    return {"message": "Password has been reset successfully."}
