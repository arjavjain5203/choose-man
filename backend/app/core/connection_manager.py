from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()

        existing_websocket = self.active_connections.get(user_id)
        if existing_websocket is not None and existing_websocket is not websocket:
            try:
                await existing_websocket.close()
            except Exception:
                pass

        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str) -> None:
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, message: dict) -> None:
        websocket = self.active_connections.get(user_id)
        if websocket is None:
            return

        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(user_id)


connection_manager = ConnectionManager()
