import boto3
import os
import pytesseract
from PIL import Image
import io
import fitz  # PyMuPDF
import database
from bson import ObjectId
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from botocore.exceptions import NoCredentialsError, ClientError
import tempfile
import google.generativeai as genai

# --- CONFIGURATIONS ---
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Configure Gemini Pro
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in the environment variables.")
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-pro')


def encrypt_file(file_bytes: bytes) -> bytes:
    # Placeholder for real encryption later
    print("Encrypting file...")
    return file_bytes


def upload_to_s3(file_bytes: bytes, user_id: str, document_id: str) -> str:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
        region_name=os.getenv("S3_REGION")
    )
    bucket_name = os.getenv("S3_BUCKET_NAME")
    object_key = f"uploads/{user_id}/{document_id}.enc"

    try:
        s3_client.put_object(Bucket=bucket_name, Key=object_key, Body=file_bytes)
        print(f"Successfully uploaded {object_key} to S3 bucket {bucket_name}.")
        return object_key
    except NoCredentialsError:
        print("!!! S3 ERROR: Credentials not available or configured incorrectly.")
        raise
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        print(f"!!! S3 CLIENT ERROR: An error occurred ({error_code}). Check your credentials, bucket name, and region.")
        print(f"!!! Full AWS Error Message: {e}")
        raise e


def download_from_s3(object_key: str) -> bytes:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
        region_name=os.getenv("S3_REGION")
    )
    bucket_name = os.getenv("S3_BUCKET_NAME")
    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    print(f"Successfully downloaded {object_key} from S3.")
    return response['Body'].read()


def run_ocr_on_image_bytes(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image)


# --- NEW CHUNKING AND INDEXING FUNCTIONS ---
def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        # advance start while keeping an overlap between adjacent chunks
        start += max(1, chunk_size - chunk_overlap)
    return chunks


def create_faiss_index(embeddings: np.ndarray):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index


def save_faiss_index(index, user_id: str, document_id: str):
    """Saves the FAISS index to S3 using a temporary file for compatibility."""
    index_path = f"faiss_indexes/{user_id}/{document_id}.index"
    
    # Create a temporary file with explicit permissions
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.index', dir="tmp")
    temp_file.close()  # Close the file handle so FAISS can write to it
    
    try:
        # Write index to temporary file
        faiss.write_index(index, temp_file.name)
        
        # Read the file as bytes
        with open(temp_file.name, 'rb') as f:
            index_bytes = f.read()
        
        # Upload to S3
        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
            region_name=os.getenv("S3_REGION")
        )
        bucket_name = os.getenv("S3_BUCKET_NAME")
        s3_client.put_object(Bucket=bucket_name, Key=index_path, Body=index_bytes)
        print(f"Successfully saved FAISS index to {index_path} in S3.")
        return index_path
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_file.name)
        except:
            pass


# --- FULL PIPELINE FUNCTION ---
def process_document_pipeline(document_id: str):
    print(f"BACKGROUND PIPELINE: Starting for document: {document_id}")
    documents_collection = database.db["documents"]

    try:
        # 1. OCR STEP
        doc = documents_collection.find_one({"_id": ObjectId(document_id)})
        if not doc or "s3_key" not in doc:
            raise Exception("Document or S3 key not found.")

        file_bytes = download_from_s3(doc["s3_key"])
        filename = doc["filename"].lower()
        extracted_text = ""

        if filename.endswith(('.png', '.jpg', '.jpeg')):
            extracted_text = run_ocr_on_image_bytes(file_bytes)
        elif filename.endswith('.pdf'):
            pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
            full_text_list = []
            for page in pdf_doc:
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                full_text_list.append(run_ocr_on_image_bytes(img_bytes))
            extracted_text = "\n".join(full_text_list)

        documents_collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": {"status": "ocr_complete", "extracted_text": extracted_text}}
        )
        print(f"BACKGROUND PIPELINE: OCR complete for document: {document_id}")

        # 2. CHUNKING & INDEXING STEP (New Logic)
        if extracted_text:
            text_chunks = chunk_text(extracted_text)
            print(f"Creating embeddings for {len(text_chunks)} chunks...")
            chunk_embeddings = embedding_model.encode(text_chunks).astype('float32')

            faiss_index = create_faiss_index(chunk_embeddings)
            index_s3_path = save_faiss_index(faiss_index, doc["user_id"], document_id)

            documents_collection.update_one(
                {"_id": ObjectId(document_id)},
                {"$set": {
                    "status": "indexing_complete",
                    "text_chunks": text_chunks,
                    "faiss_index_path": index_s3_path
                }}
            )
            print(f"BACKGROUND PIPELINE: FAISS indexing complete for document: {document_id}")

    except Exception as e:
        print(f"ERROR: AI Pipeline failed for document {document_id}: {e}")
        documents_collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": {"status": "pipeline_failed", "error_message": str(e)}}
        )


# --- RAG QUESTION ANSWERING FUNCTION ---
def load_faiss_index_from_s3(user_id: str, document_id: str):
    """Loads the FAISS index from S3 using a temporary file for compatibility."""
    doc = database.db["documents"].find_one({"_id": ObjectId(document_id)})
    index_path = doc.get("faiss_index_path")
    if not index_path:
        raise Exception("FAISS index path not found in document record.")

    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
        region_name=os.getenv("S3_REGION")
    )
    bucket_name = os.getenv("S3_BUCKET_NAME")

    # Create a temporary file with explicit permissions
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.index', dir="tmp")
    temp_file.close()  # Close the file handle so FAISS can read from it
    
    try:
        # Download from S3 to temporary file
        with open(temp_file.name, 'wb') as f:
            s3_client.download_fileobj(bucket_name, index_path, f)
        
        # Read the index from the temporary file
        index = faiss.read_index(temp_file.name)
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_file.name)
        except:
            pass

    print(f"Successfully loaded FAISS index from {index_path}")
    return index


def answer_question_with_rag(document_id: str, question: str) -> str:
    """Answers a question using RAG (Retrieval Augmented Generation)."""
    documents_collection = database.db["documents"]
    
    try:
        # 1. Get document info
        doc = documents_collection.find_one({"_id": ObjectId(document_id)})
        if not doc:
            raise Exception("Document not found")
        
        if doc.get("status") != "indexing_complete":
            raise Exception(f"Document not ready for questions. Status: {doc.get('status')}")
        
        if "faiss_index_path" not in doc or "text_chunks" not in doc:
            raise Exception("Document missing FAISS index or text chunks")
        
        # 2. Load FAISS index from S3
        print(f"Loading FAISS index from: {doc['faiss_index_path']}")
        faiss_index = load_faiss_index_from_s3(doc["user_id"], document_id)
        text_chunks = doc["text_chunks"]
        
        # 3. Create embedding for the question
        question_embedding = embedding_model.encode([question]).astype('float32')
        
        # 4. Search for most relevant chunks
        k = min(3, len(text_chunks))  # Get top 3 most relevant chunks
        distances, indices = faiss_index.search(question_embedding, k)
        
        # 5. Retrieve relevant text chunks
        relevant_chunks = [text_chunks[idx] for idx in indices[0] if idx < len(text_chunks)]
        
        if not relevant_chunks:
            return "I couldn't find relevant information in the document to answer your question."
        
        # 6. Generate a real answer using the Gemini Pro LLM
        context = "\n\n".join(relevant_chunks)

        prompt = f"""
Based ONLY on the following context from a legal document, answer the user's question in a clear and simple manner.
Do not use any outside knowledge. If the answer is not in the context, state that you cannot find the answer in this document.

Context:
---
{context}
---

Question: {question}

Answer:
"""

        # This is the actual call to the LLM
        response = gemini_model.generate_content(prompt)
        answer = response.text

        return answer
        
    except Exception as e:
        print(f"Error in RAG: {e}")
        return f"I encountered an error while processing your question: {str(e)}"