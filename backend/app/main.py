from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router as question_router
from app.api.websocket import router as websocket_router

app = FastAPI(title="Anonymous Decision Backend")

frontend_dist_dir = Path(__file__).resolve().parents[2] / "frontend" / "dist"
frontend_assets_dir = frontend_dist_dir / "assets"
frontend_index_file = frontend_dist_dir / "index.html"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(question_router)
app.include_router(websocket_router)

app.mount("/assets", StaticFiles(directory=frontend_assets_dir, check_dir=False), name="assets")


@app.get("/{full_path:path}")
async def serve_react(full_path: str) -> FileResponse:
    if not frontend_index_file.exists():
        raise HTTPException(status_code=404, detail="Frontend build not found.")

    return FileResponse(frontend_index_file)
