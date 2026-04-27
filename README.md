# Choose Man

Choose Man is an anonymous real-time decision app. One user creates a yes/no question, shares a link, and the recipient answers from a separate anonymous browser session. The sender sees the answer instantly over WebSockets.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: FastAPI, WebSockets, in-memory storage
- Identity: anonymous `userId` stored in `localStorage` with `crypto.randomUUID()`

## Project Structure

```text
choose-man/
├── Dockerfile
├── backend/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── services/
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
└── frontend/
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

If `VITE_API_BASE_URL` is not set, the frontend uses `http://localhost:8000` during local development and falls back to the same origin in a containerized deployment.

## Docker Deployment

Render-friendly single-image build from the repo root:

```bash
docker build -t choose-man .
docker run --rm -p 10000:10000 choose-man
```

This image bundles the frontend and backend into one container:

- FastAPI serves the built React app and all API routes from the same process
- WebSockets continue to work at `/ws/{user_id}`
- the backend still uses in-memory storage, so restarting the container clears all questions

Local run with a custom public origin for generated share links:

```bash
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e FRONTEND_BASE_URL=http://localhost:3000 \
  -e CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000 \
  choose-man
```

For Render:

```bash
Render will build and run the root Dockerfile automatically.
```

Set these environment variables in Render:

```bash
PORT=10000
FRONTEND_BASE_URL=https://your-app.onrender.com
CORS_ORIGINS=https://your-app.onrender.com
```

If you use Render's Docker service, the image only needs to listen on `$PORT`.

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
