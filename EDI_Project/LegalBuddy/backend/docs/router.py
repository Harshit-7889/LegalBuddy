from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException
from typing import List, Optional, Dict, Any
from pymongo.collection import Collection
from bson import ObjectId
import datetime
from pydantic import BaseModel

from auth.auth import get_current_user_optional, get_current_user
import database
from . import service
from auth.schemas import DocumentPublic

router = APIRouter(tags=["Documents"])

class ChatRequest(BaseModel):
    question: str

@router.post("/docs/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    actions: List[str] = Form(...),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    documents_collection: Collection = database.db["documents"]
    user_id = current_user["sub"] if current_user else "guest"
    doc = {"user_id": user_id, "filename": file.filename, "actions": actions, "status": "uploading", "created_at": datetime.datetime.now(datetime.timezone.utc)}
    result = documents_collection.insert_one(doc)
    document_id = str(result.inserted_id)
    file_bytes = await file.read()
    encrypted_bytes = service.encrypt_file(file_bytes)
    s3_key = service.upload_to_s3(encrypted_bytes, user_id, document_id)
    documents_collection.update_one(
        {"_id": ObjectId(document_id)},
        {"$set": {"status": "processing", "s3_key": s3_key}}
    )
    background_tasks.add_task(service.process_document_pipeline, document_id)
    return {"document_id": document_id, "status": "processing"}

@router.post("/docs/{document_id}/chat")
def chat_with_document(document_id: str, request: ChatRequest):
    try:
        answer = service.answer_question_with_rag(document_id, request.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/docs/{document_id}", response_model=DocumentPublic)
def get_document(document_id: str, current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    documents_collection: Collection = database.db["documents"]
    try:
        oid = ObjectId(document_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID format.")
    doc = documents_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if current_user:
        user_email = current_user["sub"]
        if doc["user_id"] != user_email and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized.")
    else:
        if doc["user_id"] != "guest":
            raise HTTPException(status_code=403, detail="Not authorized.")
    return DocumentPublic(**doc, id=str(doc["_id"]))