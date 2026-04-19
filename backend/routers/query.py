from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from backend.services.embedder import Embedder
from backend.services.vector_store import VectorStore
from backend.services.llm_service import LLMService
from backend.config import get_settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Instantiate services
embedder = Embedder()
vector_store = VectorStore()
llm_service = LLMService()

class QueryRequest(BaseModel):
    question: str

@router.post("/stream")
async def stream_query(request: QueryRequest):
    """
    Takes a question, finds relevant context, and streams back the LLM answer using SSE.
    """
    settings = get_settings()
    
    try:
        logger.info(f"Received query request: '{request.question}'")
        
        # 1. Embed query
        logger.info("Embedding query...")
        query_embedding = embedder.embed_query(request.question)

        # 2. Retrieve relevant chunks
        logger.info("Performing similarity search in Vector Store...")
        context_chunks = vector_store.search(
            query_embedding, 
            top_k=settings.top_k_results,
            threshold=settings.similarity_threshold
        )
        logger.info(f"Found {len(context_chunks)} relevant chunks above threshold.")
        
        # 3. Setup Response Stream Generator
        async def response_generator():
            # First, send the sources as a metadata event so the UI can display them immediately
            sources = []
            for chunk in context_chunks:
                sources.append({
                    "doc_name": chunk["metadata"].get("doc_name"),
                    "page": chunk["metadata"].get("page"),
                    "score": round(chunk["score"], 3),
                    "text": chunk["text"]
                })
            
            import json
            yield {"event": "sources", "data": json.dumps(sources)}

            # Then, stream the LLM answer text
            async for chunk_text in llm_service.generate_answer_stream(request.question, context_chunks):
                # SSE dictates we send "data: content" lines
                # The EventSourceResponse handles the formatting, we just yield strings or dicts
                yield {"event": "message", "data": chunk_text}
                
            yield {"event": "done", "data": "[DONE]"}

        return EventSourceResponse(response_generator())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
