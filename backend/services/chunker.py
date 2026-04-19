from langchain_text_splitters import RecursiveCharacterTextSplitter
from backend.config import get_settings

class Chunker:
    """Chunks structured pages of text into embedded chunks."""
    
    def __init__(self):
        settings = get_settings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def chunk(self, pages: list[dict], doc_id: str, doc_name: str) -> list[dict]:
        """
        Chunks the parsed pages into smaller segments suitable for embeddings.
        Input: list of {"text": str, "metadata": {"page": int}}
        Output: list of {"text": str, "metadata": {"doc_id": ..., "doc_name": ..., "page": int, "chunk_index": int}}
        """
        final_chunks = []
        chunk_index = 0

        for page in pages:
            text = page["text"]
            page_num = page["metadata"]["page"]
            
            # Split text using LangChain
            sub_chunks = self.text_splitter.split_text(text)
            
            for sub_chunk in sub_chunks:
                final_chunks.append({
                    "text": sub_chunk,
                    "metadata": {
                        "doc_id": doc_id,
                        "doc_name": doc_name,
                        "page": page_num,
                        "chunk_index": chunk_index
                    }
                })
                chunk_index += 1
                
        return final_chunks
