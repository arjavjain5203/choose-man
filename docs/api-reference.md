# API Reference

## REST API

### Create Question
`POST /question`

Creates a new decision request.

**Headers:**
- `x-user-id` (Required): A unique identifier for the user (used for rate limiting).

**Request Body:**
```json
{
  "text": "Should I order pizza?",
  "sender_id": "unique-user-id",
  "mode": "fixed" // or "random"
}
```

**Response:**
```json
{
  "question_id": "uuid-string"
}
```

---

### Get Question
`GET /question/{question_id}`

Retrieves details of a specific question.

**Response:**
```json
{
  "id": "uuid-string",
  "text": "Should I order pizza?",
  "sender_id": "unique-user-id",
  "mode": "fixed",
  "created_at": "2023-10-27T10:00:00",
  "expires_at": "2023-10-27T11:00:00",
  "is_answered": false,
  "answer": null
}
```

---

### Submit Answer
`POST /answer`

Submits an answer to a question.

**Request Body:**
```json
{
  "question_id": "uuid-string",
  "user_id": "respondent-id",
  "user_choice": "YES" // Required for both modes: YES/NO for fixed, A/B for random
}
```

**Response:**
```json
{
  "answer": "YES"
}
```

---

## WebSocket API

### Real-time Updates
`WS /ws/{user_id}`

Establishes a WebSocket connection to receive real-time notifications for questions created by this user.

**Message Format (Sent by Server):**
```json
{
  "type": "answer",
  "question_id": "uuid-string",
  "answer": "YES"
}
```

---

## Errors

- `404 Not Found`: Question does not exist.
- `400 Bad Request`:
  - Question has expired.
  - Question is already answered.
  - Missing `user_choice` for fixed/random mode.
  - Missing `x-user-id` header for creation.
- `429 Too Many Requests`: Rate limit exceeded (100 requests per minute).
- `503 Service Unavailable`: Rate limiter (Redis) is down.
