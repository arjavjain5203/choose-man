# Setup & Development Guide

This guide covers how to set up Choose-Man for local development and production-like environments.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**
- **Docker** (optional)

## Local Development

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate # Linux/macOS
    # .venv\Scripts\activate # Windows
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the backend server:
    ```bash
    python run.py
    ```
    The backend will start on `http://localhost:10000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

---

## Testing

### Backend Tests
Run the Python test suite using `pytest`:
```bash
cd backend
source .venv/bin/activate
pytest
```

---

## Production Deployment (Docker)

The application can be built and run as a single container. The backend serves the compiled frontend.

1.  Build the frontend:
    ```bash
    cd frontend
    npm install
    npm run build
    ```
2.  Build the Docker image from the root directory:
    ```bash
    docker build -t choose-man .
    ```
3.  Run the container:
    ```bash
    docker run -p 10000:10000 choose-man
    ```

---

## Configuration

Environment variables used by the backend:
- `PORT`: The port the backend server listens on (default: `10000`).
