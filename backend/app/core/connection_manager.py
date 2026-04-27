from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()

        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str, websocket: WebSocket | None = None) -> None:
        active_websocket = self.active_connections.get(user_id)
        if active_websocket is None:
            return

        if websocket is not None and active_websocket is not websocket:
            return

        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, message: dict) -> None:
        websocket = self.active_connections.get(user_id)
        if websocket is None:
            return

        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(user_id, websocket)


connection_manager = ConnectionManager()
