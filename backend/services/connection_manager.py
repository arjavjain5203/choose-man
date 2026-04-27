from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()

        existing_socket = self._connections.get(user_id)
        if existing_socket is not None:
            await existing_socket.close(code=1000)

        self._connections[user_id] = websocket

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        active_socket = self._connections.get(user_id)
        if active_socket is websocket:
            self._connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, payload: dict) -> None:
        websocket = self._connections.get(user_id)
        if websocket is None:
            return

        try:
            await websocket.send_json(payload)
        except RuntimeError:
            self._connections.pop(user_id, None)

    def reset(self) -> None:
        self._connections.clear()


connection_manager = ConnectionManager()
