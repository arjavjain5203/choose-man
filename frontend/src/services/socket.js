function buildSocketUrl(userId) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.hostname}:8000/ws/${encodeURIComponent(userId)}`;
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
