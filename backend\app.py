"""
MediMate AI - Full-Stack REST API Server (FastAPI)
Provides endpoints for document upload, text extraction, grounded summarization,
timeline management, and ABDM/FHIR R4 resource export.
"""

import os
import shutil
from typing import Dict, Any, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ocr_engine import MedicalOcrEngine, parse_clinical_entities
from summarizer import ClinicalSummarizer

app = FastAPI(
    title="MediMate AI API",
    description="AI-Powered Personal Health Copilot REST Backend",
    version="1.0.0"
)

# CORS middleware for seamless communication with web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ocr_engine = MedicalOcrEngine()
summarizer = ClinicalSummarizer()

# In-memory document repository for local hackathon prototyping
HEALTH_RECORDS_DB: List[Dict[str, Any]] = []


@app.get("/")
def root():
    return {
        "app": "MediMate AI Backend",
        "status": "online",
        "endpoints": [
            "/api/upload",
            "/api/extract",
            "/api/summarize",
            "/api/documents",
            "/api/documents/{id}/fhir"
        ]
    }


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Validate and store uploaded PDF, JPG, or PNG medical document.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    allowed = [".pdf", ".jpg", ".jpeg", ".png"]
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {allowed}")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text using OCR / PDF direct parser
    extracted = ocr_engine.extract_text(file_path)
    entities = parse_clinical_entities(extracted["full_text"])

    return {
        "filename": file.filename,
        "filePath": file_path,
        "isScanned": extracted["is_scanned"],
        "extractedTextLength": extracted["extracted_chars"],
        "rawText": extracted["full_text"][:2000],  # preview
        "extractedEntities": entities
    }


@app.post("/api/summarize")
def summarize_document(payload: Dict[str, Any], language: str = Query("en", regex="^(en|te)$")):
    """
    Generate grounded clinical summary in English or Telugu.
    """
    summary = summarizer.generate_summary(payload, language=language)
    return summary


@app.get("/api/documents")
def get_documents_timeline():
    """
    Retrieve chronological health timeline.
    """
    return {"documents": HEALTH_RECORDS_DB}


@app.post("/api/documents")
def save_verified_document(document: Dict[str, Any]):
    """
    Save user-verified document to timeline.
    """
    document["processingStatus"] = "verified"
    HEALTH_RECORDS_DB.insert(0, document)
    return {"status": "saved", "id": document.get("id")}


@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str):
    """
    Delete sensitive record from health timeline.
    """
    global HEALTH_RECORDS_DB
    HEALTH_RECORDS_DB = [d for d in HEALTH_RECORDS_DB if d.get("id") != doc_id]
    return {"status": "deleted", "id": doc_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
