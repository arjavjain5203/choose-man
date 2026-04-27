const STORAGE_KEY = "choose-man-anonymous-user-id";

export function getAnonymousUserId() {
  const existingId = window.localStorage.getItem(STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const createdId = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, createdId);
  return createdId;
}
