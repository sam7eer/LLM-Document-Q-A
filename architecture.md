# DocuMind System Architecture

This document describes the high-level architecture of the **DocuMind** LLM-based Document Q&A system.

## High-Level Overview

DocuMind is a Local-First RAG (Retrieval-Augmented Generation) application built with a **FastAPI** backend and a **React/Vite** frontend. It follows a modular architecture where each component of the RAG pipeline is isolated into its own service.

---

## 2. Component Breakdown

### Frontend (React + TypeScript)
- **Sidebar**: Manages document library and uploads.
- **Chat Interface**: Handles real-time streaming interaction.
- **`useChat` Hook**: Manages Server-Sent Events (SSE) decoding and message state.
- **Axios Client**: Handles standard REST calls for file management.

### Backend (FastAPI)
- **Routers**:
    - `documents.py`: Handles file uploads, listing, and deletion.
    - `query.py`: Handles synchronous retrieval and asynchronous LLM streaming.
- **Service Layer**:
    - **`DocumentProcessor`**: Uses `PyMuPDF` and `python-docx` to extract raw text and metadata.
    - **`Chunker`**: Uses LangChain's `RecursiveCharacterTextSplitter` to create overlapping text segments (Default: 800 chars, 150 overlap).
    - **`Embedder`**: Communicates with Google's `gemini-embedding-001` via the new `google-genai` SDK. Implements batching (100 items/request).
    - **`VectorStore`**: A wrapper around `ChromaDB` (Persistent Client). Uses Cosine Similarity for searching.
    - **`LLMService`**: Manages communication with `gemini-2.0-flash`. Formats the RAG prompt with retrieved context and streams responses using Python's `AsyncGenerator`.

---

## 3. Data Flow

### Document Ingestion
1. **Upload**: User uploads a file.
2. **Parsing**: Backend extracts text page-by-page.
3. **Chunking**: Text is split into semantic segments.
4. **Embedding**: Segments are converted into 3072-dimensional vectors.
5. **Storage**: Vectors and original text metadata are saved in the local ChromaDB database.

### Retrieval & Generation
1. **Query**: User asks a question.
2. **Embedding**: The question is embedded using the same model.
3. **Search**: ChromaDB finds the "Top-K" chunks (closest in vector space) with a similarity score > 0.65.
4. **Augmentation**: Chunks are injected into a specialized System Instruction as context.
5. **Generation**: Gemini 2.0 Flash generates a response citing relevant sources.
6. **Streaming**: Response is pushed to the frontend via Server-Sent Events (SSE).

---

## 4. Key Technologies
- **Core**: Python 3.13, Node.js.
- **Backend Framework**: FastAPI.
- **AI/LLM**: Google Gemini 2.0 Flash, Gemini Embedding 001.
- **Vector Database**: ChromaDB.
- **Document Parsing**: PyMuPDF (`fitz`), `python-docx`.
- **Frontend**: React, Vite, Lucide-React, React-Markdown.
- **Dev Tools**: Pydantic Settings, sse-starlette, Axios.
