import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Define directories needed for the application
UPLOADS_DIR = "uploads"
CHROMA_DB_DIR = "chroma_db"

def create_directories():
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    os.makedirs(CHROMA_DB_DIR, exist_ok=True)

import logging

# Configure basic logging for the backend
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Run directory creation on startup
create_directories()
logger.info("Application directories initialized")

app = FastAPI(title="LLM-Based Q&A System API")
logger.info("FastAPI application created")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Document Q&A API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from backend.routers import documents, query
from backend.config import get_settings
get_settings.cache_clear()  # Ensure fresh config on every restart

app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
