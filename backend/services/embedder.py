from google import genai
from backend.config import get_settings
import logging

logger = logging.getLogger(__name__)

class Embedder:
    """Wrapper for the Google Gemini embeddings API (using new google-genai SDK)."""

    def __init__(self):
        self.settings = get_settings()
        self.client = genai.Client(api_key=self.settings.google_api_key)
        self.model_name = self.settings.embedding_model
        logger.info(f"Embedder initialized with model: {self.model_name}")

    BATCH_SIZE = 100  # Gemini API limit per batch request

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Embeds a list of document chunks for storage, batching if needed."""
        import time
        if not texts:
            return []

        all_embeddings = []
        for i in range(0, len(texts), self.BATCH_SIZE):
            batch = texts[i : i + self.BATCH_SIZE]
            logger.info(f"Embedding batch {i // self.BATCH_SIZE + 1} ({len(batch)} chunks)...")
            result = self.client.models.embed_content(
                model=self.model_name,
                contents=batch,
            )
            all_embeddings.extend([e.values for e in result.embeddings])
            logger.info(f"Batch {i // self.BATCH_SIZE + 1} complete. Appended {len(result.embeddings)} vectors.")
            
            # Simple rate limiting protection to avoid triggering exponential backoffs inside the SDK
            if i + self.BATCH_SIZE < len(texts):
                logger.info("Sleeping for 3 seconds before next batch to respect rate limits...")
                time.sleep(3)

        logger.info(f"Finished embedding all {len(all_embeddings)} chunks.")
        return all_embeddings

    def embed_query(self, query: str) -> list[float]:
        """Embeds a single search query."""
        result = self.client.models.embed_content(
            model=self.model_name,
            contents=[query],
        )
        return result.embeddings[0].values
