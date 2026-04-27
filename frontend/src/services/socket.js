const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

function buildSocketUrl(userId) {
  const socketUrl = new URL(BASE_URL);
  socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
  socketUrl.pathname = `/ws/${encodeURIComponent(userId)}`;
  socketUrl.search = "";
  socketUrl.hash = "";
  return socketUrl.toString();
}

export function connect(userId, onMessageCallback) {
  const socket = new WebSocket(buildSocketUrl(userId));

  socket.onopen = () => {
    console.info("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      onMessageCallback?.(payload);
    } catch (error) {
      console.error("Invalid WebSocket message", error);
    }
  };

  socket.onclose = () => {
    console.info("WebSocket disconnected");
  };

  return {
    socket,
    close() {
      socket.close();
    },
  };
}
