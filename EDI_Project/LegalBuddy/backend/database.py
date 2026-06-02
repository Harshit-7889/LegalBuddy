import os
from pymongo import MongoClient
from pymongo.database import Database
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

MONGO_DATABASE_URL = os.getenv("MONGO_DATABASE_URL", "")
DB_NAME = os.getenv("MONGO_DB_NAME", "legalbuddy")

client: Optional[MongoClient] = None
db: Optional[Database] = None

def connect_to_mongo():
    global client, db
    if not MONGO_DATABASE_URL:
        raise RuntimeError("MONGO_DATABASE_URL is not set in environment")
    client = MongoClient(MONGO_DATABASE_URL)
    db = client[DB_NAME]
    print("✅ Successfully connected to MongoDB.")
    # Ensure email index
    users = db["users"]
    users.create_index("email", unique=True)


def close_mongo_connection():
    if client:
        client.close()
        print("🛑 MongoDB connection closed.")
