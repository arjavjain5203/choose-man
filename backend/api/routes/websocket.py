from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.connection_manager import connection_manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str) -> None:
    await connection_manager.connect(user_id, websocket)

    try:
        while True:
            message = await websocket.receive_text()
            if message.lower() == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        connection_manager.disconnect(user_id, websocket)
