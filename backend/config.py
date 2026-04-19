import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    google_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"
    embedding_model: str = "gemini-embedding-001"   # confirmed working on free-tier API
    chroma_persist_dir: str = "./chroma_db"
    chunk_size: int = 800
    chunk_overlap: int = 150
    top_k_results: int = 5
    similarity_threshold: float = 0.65

    model_config = SettingsConfigDict(env_file=ENV_FILE_PATH, extra="ignore")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
