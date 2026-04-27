function resolveApiBaseUrl() {
  const explicitBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:8000";
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:8000";
}

const API_BASE_URL = resolveApiBaseUrl();

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.detail || "Something went wrong.";
    throw new Error(message);
  }

  return payload;
}

export async function createQuestion({ senderId, text }) {
  return request("/question", {
    method: "POST",
    body: JSON.stringify({
      sender_id: senderId,
      text,
    }),
  });
}

export async function getQuestion(questionId) {
  return request(`/question/${questionId}`);
}

export async function submitAnswer({ questionId, receiverId, answer }) {
  return request("/answer", {
    method: "POST",
    body: JSON.stringify({
      question_id: questionId,
      receiver_id: receiverId,
      answer,
    }),
  });
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getWebSocketBaseUrl() {
  if (import.meta.env.DEV) {
    return "ws://localhost:8000";
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin.replace(/^http/, "ws")}`;
  }

  return "ws://localhost:8000";
}
