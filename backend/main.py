from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response

from api.routes.health import router as health_router
from api.routes.questions import router as questions_router
from api.routes.websocket import router as websocket_router
from core.config import get_settings

settings = get_settings()
frontend_dist_dir = Path(__file__).resolve().parent / "frontend_dist"

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


def _frontend_index_path() -> Path:
    return frontend_dist_dir / "index.html"


def _safe_dist_path(relative_path: str) -> Path | None:
    candidate = (frontend_dist_dir / relative_path).resolve()
    try:
        candidate.relative_to(frontend_dist_dir.resolve())
    except ValueError:
        return None
    return candidate


@app.get("/", include_in_schema=False)
async def serve_frontend_root() -> Response:
    index_path = _frontend_index_path()
    if index_path.exists():
        return FileResponse(index_path)
    return Response(status_code=404)


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str) -> Response:
    if full_path.startswith("ws"):
        return Response(status_code=404)

    index_path = _frontend_index_path()
    if not index_path.exists():
        return Response(status_code=404)

    asset_path = _safe_dist_path(full_path)
    if asset_path is not None and asset_path.is_file():
        return FileResponse(asset_path)

    return FileResponse(index_path)
