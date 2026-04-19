import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.document_processor import DocumentProcessor
from backend.services.chunker import Chunker
from backend.services.embedder import Embedder
from backend.services.vector_store import VectorStore
from backend.main import UPLOADS_DIR

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Instantiate services (in a real app, use Dependency Injection e.g. Depends())
chunker = Chunker()
embedder = Embedder()
vector_store = VectorStore()

@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    """Uploads a document, parses it, chunks it, embeds it, and stores it in the vector DB."""
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOADS_DIR, f"{doc_id}_{file.filename}")

    logger.info(f"Starting upload process for file: {file.filename} (Assigned ID: {doc_id})")

    try:
        # 1. Save file locally
        logger.info("Step 1: Saving file to disk...")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Parse file context
        logger.info("Step 2: Parsing document text...")
        pages = DocumentProcessor.parse_file(file_path, file.filename)
        if not pages:
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")

        # 3. Chunk text
        logger.info("Step 3: Chunking document text...")
        chunks = chunker.chunk(pages, doc_id, file.filename)
        if not chunks:
            raise HTTPException(status_code=400, detail="No chunks generated from the document.")

        # 4. Embed chunks
        logger.info(f"Step 4: Embedding {len(chunks)} chunks via Gemini API...")
        texts_to_embed = [c["text"] for c in chunks]
        embeddings = embedder.embed_documents(texts_to_embed)

        # 5. Store in Vector DB
        logger.info("Step 5: Storing embedded chunks in ChromaDB...")
        metadatas = [c["metadata"] for c in chunks]
        vector_store.add_document(doc_id, texts_to_embed, embeddings, metadatas)

        logger.info(f"Successfully processed and stored document: {file.filename}")
        return {
            "status": "success",
            "doc_id": doc_id,
            "filename": file.filename,
            "chunks_processed": len(chunks)
        }

    except Exception as e:
        logger.error(f"Error during upload_document: {str(e)}", exc_info=True)
        # Cleanup file if failed
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
def list_documents():
    """Lists all the unique documents stored in the database."""
    logger.info("Received request to list documents")
    try:
        docs = vector_store.list_documents()
        return {"documents": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    """Deletes a document and its embeddings from the database."""
    try:
        vector_store.delete_document(doc_id)
        
        # Try to delete the local file as well if it exists
        # This requires searching the uploads dir since we appended the original filename
        for f in os.listdir(UPLOADS_DIR):
            if f.startswith(doc_id):
                os.remove(os.path.join(UPLOADS_DIR, f))
                
        return {"status": "success", "message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
