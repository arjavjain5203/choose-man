import pytest
from fastapi.testclient import TestClient

from app.db.storage import questions
from app.main import app


@pytest.fixture(autouse=True)
def clear_questions() -> None:
    questions.clear()
    yield
    questions.clear()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
