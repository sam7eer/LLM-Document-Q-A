import chromadb
from chromadb.config import Settings as ChromaDBConfig
from backend.config import get_settings

class VectorStore:
    """
    Designed as an abstract wrapper interface! 
    This ensures that migrating to Qdrant or Pinecone later ONLY requires 
    changing the code inside this single file, leaving the rest of the app untouched.
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.client = chromadb.PersistentClient(path=self.settings.chroma_persist_dir)
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )

    def add_document(self, doc_id: str, chunks: list[str], embeddings: list[list[float]], metadatas: list[dict]):
        """Adds a document's chunks and embeddings to the DB."""
        if not chunks:
            return
            
        ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
        self.collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )

    def search(self, query_embedding: list[float], top_k: int = 5, threshold: float = 0.65) -> list[dict]:
        """
        Searches the DB for chunks similar to the query.
        Returns chunks with cosine similarity >= threshold.
        """
        # ChromaDB cosine returns distance. Similarity = 1 - distance.
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=['documents', 'metadatas', 'distances']
        )
        
        matches = []
        if not results['ids'][0]:
            return matches

        for i in range(len(results['ids'][0])):
            distance = results['distances'][0][i]
            similarity = 1.0 - distance
            
            if similarity >= threshold:
                matches.append({
                    "id": results['ids'][0][i],
                    "text": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "score": similarity
                })
                
        # Sort by best score
        matches.sort(key=lambda x: x['score'], reverse=True)
        return matches

    def delete_document(self, doc_id: str):
        """Deletes all chunks belonging to a document from the DB."""
        # Workaround since some Chroma versions do not allow filtering on delete easily
        self.collection.delete(where={"doc_id": doc_id})

    def list_documents(self) -> list[dict]:
        """Gets unique documents stored in the database."""
        # Note: This is an expensive operation in ChromaDB, usually we would keep 
        # a separate relational DB table (e.g. SQLite) for document metadata. 
        # But for this simple system, we just fetch all items and group by doc_id.
        results = self.collection.get(include=['metadatas'])
        
        docs = {}
        for meta in results.get('metadatas', []):
            if not meta:
                continue
            doc_id = meta.get("doc_id")
            if doc_id not in docs:
                docs[doc_id] = {
                    "id": doc_id,
                    "name": meta.get("doc_name", "Unknown"),
                    "chunks": 1
                }
            else:
                docs[doc_id]["chunks"] += 1
                
        return list(docs.values())
