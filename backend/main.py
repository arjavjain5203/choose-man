from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.health import router as health_router
from api.routes.questions import router as questions_router
from api.routes.websocket import router as websocket_router
from core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.api_title)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(questions_router)
app.include_router(websocket_router)
