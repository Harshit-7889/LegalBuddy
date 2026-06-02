import os
import shutil
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import database
from auth.auth import get_password_hash
from docs.router import router as docs_router
from auth.router import router as auth_router

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    database.connect_to_mongo()
    
    # --- ADD THIS BLOCK ---
    TEMP_DIR = "tmp"
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR)
    # --------------------
    
    users = database.db["users"]
    admin_email = "yash.gutte23@vit.edu"
    if not users.find_one({"email": admin_email}):
        admin_password = get_password_hash("yash.gutte23@vit.edu")
        users.insert_one({
            "name": "Admin", "email": admin_email,
            "password_hash": admin_password, "role": "admin", "status": "active",
        })
        print(f"Admin user '{admin_email}' created.")
    yield
    database.close_mongo_connection()

app = FastAPI(title="LawAssist API", lifespan=lifespan)

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(docs_router)

@app.get("/health")
def health():
    return {"status": "ok"}