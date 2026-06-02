from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str
    role_code: Optional[str] = None
    legal_id_number: Optional[str] = None


class UserPublic(BaseModel):
    name: str
    email: EmailStr
    role: str
    status: Optional[str] = "active"


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class EmailRequest(BaseModel):
    email: EmailStr


class VerifyEmailCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=4, max_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class DocumentPublic(BaseModel):
    id: str
    filename: str
    status: str
    extracted_text: Optional[str] = None
    user_id: str



