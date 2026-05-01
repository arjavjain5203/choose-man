import { getAnonymousUserId } from "../utils/user";

const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

function buildUrl(path) {
  return new URL(path, `${BASE_URL}/`).toString();
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getAnonymousUserId(),
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.detail || "Request failed.");
  }

  return payload;
}

export async function createQuestion(text, mode, sender_id) {
  return request("/question", {
    method: "POST",
    body: JSON.stringify({ text, mode, sender_id }),
  });
}

export async function getQuestion(id) {
  return request(`/question/${id}`);
}

export async function answerQuestion(question_id, user_id, user_choice) {
  const body = { question_id, user_id };
  if (typeof user_choice !== "undefined") {
    body.user_choice = user_choice;
  }

  return request("/answer", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
