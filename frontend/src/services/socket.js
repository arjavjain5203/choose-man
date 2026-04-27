function buildSocketUrl(userId) {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const protocol = origin.startsWith("https") ? "wss" : "ws";
  const host = origin.replace(/^https?:\/\//, "");
  return `${protocol}://${host}/ws/${encodeURIComponent(userId)}`;
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
