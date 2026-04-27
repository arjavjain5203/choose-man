const STORAGE_KEY = "anonymous-decision-user-id";

export function getAnonymousUserId() {
  const existingId = window.localStorage.getItem(STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const newUserId = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, newUserId);
  return newUserId;
}
