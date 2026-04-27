import pytest
from fastapi.testclient import TestClient

from app.core.connection_manager import connection_manager
from app.db.storage import questions
from app.main import app


@pytest.fixture(autouse=True)
def clear_questions() -> None:
    questions.clear()
    connection_manager.active_connections.clear()
    yield
    questions.clear()
    connection_manager.active_connections.clear()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
