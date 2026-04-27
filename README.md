# Phase 1 Backend

This repository now contains the Phase 1 FastAPI backend for an anonymous decision-making app.

Core scope:

- no frontend runtime
- no WebSockets
- no authentication
- no database
- in-memory storage only

## Project Structure

```text
choose-man/
├── Dockerfile
└── backend/
    ├── app/
    │   ├── api/
    │   ├── db/
    │   ├── models/
    │   ├── services/
    │   └── main.py
    ├── tests/
    ├── requirements.txt
    └── run.py
```

## API

- `POST /question`
- `GET /question/{id}`
- `POST /answer`
- `GET /`

### `POST /question`

Request:

```json
{
  "text": "Should I go ahead?",
  "sender_id": "user-123",
  "mode": "fixed"
}
```

Response:

```json
{
  "question_id": "uuid-string"
}
```

### `GET /question/{id}`

Returns the full stored question object.

### `POST /answer`

Request:

```json
{
  "question_id": "uuid-string",
  "user_id": "user-456",
  "user_choice": "YES"
}
```

For random mode, `user_choice` is ignored.

Response:

```json
{
  "answer": "YES"
}
```

## Local Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

The server listens on `http://localhost:10000` by default.

To override the port:

```bash
PORT=8000 python run.py
```

## Docker Run

Build and run from the repo root:

```bash
docker build -t choose-man-backend .
docker run --rm -p 10000:10000 choose-man-backend
```

To override the runtime port:

```bash
docker run --rm -p 8000:8000 -e PORT=8000 choose-man-backend
```

## Validation Rules

- missing question returns `404`
- expired question returns `400`
- already answered question returns `400`
- fixed mode requires `user_choice`

## Testing

```bash
cd backend
source .venv/bin/activate
pytest
```
