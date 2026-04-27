from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as question_router
from app.api.websocket import router as websocket_router

app = FastAPI(title="Anonymous Decision Backend")

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


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Anonymous decision backend is running."}
