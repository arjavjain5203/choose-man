# Architecture Overview

Choose-Man is an anonymous decision-making application that allows users to create questions and get real-time answers.

## Tech Stack

### Frontend
- **React**: UI library.
- **Vite**: Build tool and development server.
- **Tailwind CSS**: Styling.
- **React Router**: Client-side routing.
- **WebSockets**: Real-time communication for receiving answers.

### Backend
- **FastAPI**: Modern, high-performance web framework for Python.
- **Uvicorn**: ASGI server.
- **In-Memory Storage**: Current implementation uses an in-memory dictionary for data storage (ephemeral).
- **WebSockets**: Handles real-time notifications to question creators.

## System Components

1.  **Question Service**: Core logic for creating questions, mapping 'random' mode choices, and managing question lifecycle.
2.  **Connection Manager**: Manages active WebSocket connections to notify users when their questions are answered.
3.  **Storage Layer**: Abstracted interface for data persistence (currently in-memory).

## Data Flow

1.  **Creator** creates a question via `POST /api/question`.
2.  **Creator** establishes a WebSocket connection at `/ws/{user_id}`.
3.  **Creator** shares the link with the **Respondent**.
4.  **Respondent** fetches the question details via `GET /api/question/{id}`.
5.  **Respondent** submits an answer via `POST /api/answer`.
6.  **Backend** processes the answer:
    - If mode is `fixed`, it uses the respondent's choice.
    - If mode is `random`, it flips a coin (or uses internal mapping) to decide the answer.
7.  **Backend** sends a notification to the **Creator** via WebSocket.
8.  **Creator**'s UI updates automatically to show the result.

## Modes

- **Fixed Mode**: The respondent's choice (YES/NO) is directly recorded as the answer.
- **Random Mode**: The respondent's action triggers a random outcome (A or B mapping), effectively letting "fate" decide.
