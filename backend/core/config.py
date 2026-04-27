import os
from dataclasses import dataclass
from functools import lru_cache


def _parse_cors_origins(frontend_base_url: str) -> list[str]:
    env_value = os.getenv("CORS_ORIGINS")
    if env_value:
        return [origin.strip() for origin in env_value.split(",") if origin.strip()]

    defaults = {
        frontend_base_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    }
    return sorted(defaults)


@dataclass(frozen=True)
class Settings:
    api_title: str
    frontend_base_url: str
    cors_origins: list[str]


@lru_cache
def get_settings() -> Settings:
    frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")

    return Settings(
        api_title="Choose Man API",
        frontend_base_url=frontend_base_url,
        cors_origins=_parse_cors_origins(frontend_base_url),
    )
