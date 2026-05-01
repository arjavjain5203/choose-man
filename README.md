# Choose-Man 🕵️‍♂️

Choose-Man is an anonymous, real-time decision-making platform. Whether you need a quick YES/NO from a friend or want to let "fate" decide with a random mapping, Choose-Man makes it easy and interactive.

## Key Features

- **Anonymous Questions**: Ask anything without revealing your identity.
- **Two Decision Modes**:
  - **Fixed**: Respondent chooses YES or NO directly.
  - **Random**: Respondent triggers a random choice (Fate decides!).
- **Real-time Results**: Creators see responses instantly via WebSockets—no page refresh needed.
- **Self-Expiring**: Questions automatically expire after 10 minutes to keep things relevant.
- **Zero Database**: Built for privacy with ephemeral in-memory storage.

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React + Tailwind CSS + Vite
- **Real-time**: WebSockets
- **Containerization**: Docker

## Quick Start

### Running with Docker

```bash
# 1. Build the frontend
cd frontend && npm install && npm run build && cd ..

# 2. Build and run the container
docker build -t choose-man .
docker run -p 10000:10000 choose-man
```
Visit `http://localhost:10000` to start deciding!

### Local Development

See the [Setup & Development Guide](./docs/setup-guide.md) for detailed instructions on running the backend and frontend separately.

## Documentation

For more detailed information, check out the `docs` folder:

- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Setup & Development Guide](./docs/setup-guide.md)

## License

MIT
