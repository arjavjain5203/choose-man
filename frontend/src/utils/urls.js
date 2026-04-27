export function buildAnswerPageUrl(questionId) {
  if (typeof window === "undefined") {
    return `/answer/${questionId}`;
  }

  return `${window.location.origin}/answer/${questionId}`;
}
