# Choose Man

Choose Man is an anonymous real-time decision app. One user creates a yes/no question, shares a link, and the recipient answers from a separate anonymous browser session. The sender sees the answer instantly over WebSockets.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: FastAPI, WebSockets, in-memory storage
- Identity: anonymous `userId` stored in `localStorage` with `crypto.randomUUID()`

## Project Structure

```text
choose-man/
├── docker-compose.yml
├── backend/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── services/
│   ├── tests/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── package.json
```

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs on `http://localhost:8000` by default.

Optional environment variables:

```bash
export FRONTEND_BASE_URL=http://localhost:5173
export CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

Optional environment variable:

```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

If `VITE_API_BASE_URL` is not set, the frontend uses `http://localhost:8000` during local development and falls back to the same origin under `/api` in a containerized deployment.

## Docker Deployment

Build and run the full stack with Docker Compose:

```bash
docker compose up --build
```

The app is then available at `http://localhost:8080`.

Container behavior:

- `frontend` serves the built React app through Nginx
- `frontend` proxies REST traffic under `/api` and WebSocket traffic under `/ws` to `backend`
- `backend` runs FastAPI with Uvicorn on port `8000`
- question data stays in memory, so restarting the backend clears all questions

Useful commands:

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

Standalone image builds:

```bash
docker build -t choose-man-backend ./backend
docker build -t choose-man-frontend ./frontend
```

Optional compose overrides:

```bash
export FRONTEND_PORT=8080
export BACKEND_PORT=8000
export APP_ORIGIN=http://localhost:8080
```

## How To Use

1. Open the frontend in one browser window.
2. Create a yes/no question.
3. Copy the share link and open it in a different browser profile or incognito window.
4. Answer `YES` or `NO`.
5. Open the result page as the sender to watch the status update instantly.

Using a second browser profile matters because each browser stores its own anonymous `userId`.

## API

- `POST /question` creates a question
- `GET /question/{id}` fetches a question
- `POST /answer` submits an answer
- `GET /health` checks service health
- `WS /ws/{user_id}` subscribes a sender for live updates

## Testing

Backend tests:

```bash
cd backend
source .venv/bin/activate
pytest
```

Frontend production build:

```bash
cd frontend
npm run build
```
