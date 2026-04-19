from google import genai
from google.genai import types
from typing import AsyncGenerator
from backend.config import get_settings
import logging

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "You are a highly capable Document Q&A Assistant. "
    "You will be provided with pieces of context from uploaded documents. "
    "Your task is to answer the user's question ONLY using the provided context. "
    "If the answer is not present in the provided context, you must reply: "
    "'I couldn't find the answer to that in the uploaded documents.' "
    "Always cite your sources by referencing the document name if possible."
)

class LLMService:
    def __init__(self):
        self.settings = get_settings()
        self.client = genai.Client(api_key=self.settings.google_api_key)
        self.model_name = self.settings.llm_model
        logger.info(f"LLMService initialized with model: {self.model_name}")

    async def generate_answer_stream(self, question: str, context_chunks: list[dict]) -> AsyncGenerator[str, None]:
        """Streams back the LLM answer token by token."""
        if not context_chunks:
            yield "I couldn't find relevant information in the uploaded documents."
            return

        # Build context block
        context_str = "CONTEXT:\n"
        for i, chunk in enumerate(context_chunks):
            doc_name = chunk["metadata"].get("doc_name", f"Doc {i+1}")
            page = chunk["metadata"].get("page", "?")
            context_str += f"--- Source {i+1}: {doc_name} (Page {page}) ---\n"
            context_str += chunk['text'] + "\n\n"

        prompt = f"{context_str}\n\nQUESTION: {question}"
        logger.info(f"Sending prompt to LLM (context length: {len(context_str)} chars)")

        async for chunk in await self.client.aio.models.generate_content_stream(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
            ),
        ):
            if chunk.text:
                yield chunk.text
