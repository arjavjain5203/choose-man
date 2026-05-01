import pytest
from fastapi.testclient import TestClient

from app.core.connection_manager import connection_manager
from app.core import rate_limiter as rate_limiter_module
from app.db.storage import questions
from app.main import app


class TestRedisClient:
    def __init__(self) -> None:
        self.counts: dict[str, int] = {}
        self.expiry_calls: list[tuple[str, int]] = []

    def incr(self, key: str) -> int:
        self.counts[key] = self.counts.get(key, 0) + 1
        return self.counts[key]

    def expire(self, key: str, seconds: int) -> bool:
        self.expiry_calls.append((key, seconds))
        return True


@pytest.fixture(autouse=True)
def clear_questions() -> None:
    questions.clear()
    connection_manager.active_connections.clear()
    yield
    questions.clear()
    connection_manager.active_connections.clear()


@pytest.fixture(autouse=True)
def fake_redis_client(monkeypatch) -> TestRedisClient:
    fake_client = TestRedisClient()
    monkeypatch.setattr(rate_limiter_module, "redis_client", fake_client)
    return fake_client


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
