import { getWebSocketBaseUrl } from "./api";

function buildWebSocketUrl(userId) {
  return `${getWebSocketBaseUrl()}/ws/${encodeURIComponent(userId)}`;
}

export function createQuestionSocket(userId, { onEvent, onStatus }) {
  let websocket;
  let reconnectTimer;
  let reconnectAttempts = 0;
  let manuallyClosed = false;

  const connect = () => {
    if (manuallyClosed) {
      return;
    }

    onStatus?.("connecting");
    websocket = new WebSocket(buildWebSocketUrl(userId));

    websocket.onopen = () => {
      reconnectAttempts = 0;
      onStatus?.("connected");
    };

    websocket.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        onEvent?.(parsed);
      } catch (error) {
        onStatus?.("invalid-message");
      }
    };

    websocket.onerror = () => {
      onStatus?.("error");
    };

    websocket.onclose = () => {
      if (manuallyClosed) {
        onStatus?.("closed");
        return;
      }

      onStatus?.("reconnecting");
      const delay = Math.min(1000 * 2 ** reconnectAttempts, 5000);
      reconnectAttempts += 1;
      reconnectTimer = window.setTimeout(connect, delay);
    };
  };

  connect();

  return {
    close() {
      manuallyClosed = true;
      window.clearTimeout(reconnectTimer);
      websocket?.close();
    },
  };
}
