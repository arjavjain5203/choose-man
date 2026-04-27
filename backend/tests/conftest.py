import asyncio

import pytest
from fastapi.testclient import TestClient

from db.memory import reset_store
from main import app
from services.connection_manager import connection_manager


@pytest.fixture(autouse=True)
def clear_state() -> None:
    connection_manager.reset()
    asyncio.run(reset_store())
    yield
    connection_manager.reset()
    asyncio.run(reset_store())


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
