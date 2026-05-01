from datetime import timedelta

from app.db.storage import questions
from app.core import rate_limiter as rate_limiter_module
from app.services.question_service import utc_now


QUESTION_HEADERS = {"x-user-id": "test-user"}


class FakeRedisClient:
    def __init__(self) -> None:
        self.counts: dict[str, int] = {}
        self.expiry_calls: list[tuple[str, int]] = []
        self.raise_error = False

    def incr(self, key: str) -> int:
        if self.raise_error:
            raise RuntimeError("redis down")

        self.counts[key] = self.counts.get(key, 0) + 1
        return self.counts[key]

    def expire(self, key: str, seconds: int) -> bool:
        if self.raise_error:
            raise RuntimeError("redis down")

        self.expiry_calls.append((key, seconds))
        return True


def _question_headers(user_id: str) -> dict[str, str]:
    return {"x-user-id": user_id}


def test_create_fixed_question(client):
    response = client.post(
        "/question",
        json={
            "text": "Should I decide now?",
            "sender_id": "sender-1",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )

    assert response.status_code == 200
    payload = response.json()
    assert "question_id" in payload

    stored_question = questions[payload["question_id"]]
    assert stored_question.receiver_id is None
    assert stored_question.answer is None
    assert stored_question.option_map is None
    assert stored_question.status == "pending"
    assert stored_question.mode == "fixed"


def test_create_random_question(client):
    response = client.post(
        "/question",
        json={
            "text": "Let luck decide.",
            "sender_id": "sender-2",
            "mode": "random",
        },
        headers=QUESTION_HEADERS,
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["question_id"] in questions
    stored_question = questions[payload["question_id"]]
    assert stored_question.option_map in (
        {"A": "YES", "B": "NO"},
        {"A": "NO", "B": "YES"},
    )
    assert stored_question.answer is None


def test_get_question_returns_full_object(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Can I fetch this?",
            "sender_id": "sender-3",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )

    question_id = create_response.json()["question_id"]
    response = client.get(f"/question/{question_id}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == question_id
    assert payload["text"] == "Can I fetch this?"
    assert payload["status"] == "pending"
    assert "option_map" not in payload


def test_get_question_missing_returns_404(client):
    response = client.get("/question/missing-question")

    assert response.status_code == 404
    assert response.json()["detail"] == "Question not found."


def test_answer_fixed_question(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Answer this directly?",
            "sender_id": "sender-4",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )

    response = client.post(
        "/answer",
        json={
            "question_id": create_response.json()["question_id"],
            "user_id": "receiver-4",
            "user_choice": "YES",
        },
    )

    assert response.status_code == 200
    assert response.json()["answer"] == "YES"


def test_answer_fixed_question_requires_choice(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Need a fixed answer?",
            "sender_id": "sender-5",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )

    response = client.post(
        "/answer",
        json={
            "question_id": create_response.json()["question_id"],
            "user_id": "receiver-5",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "user_choice is required for fixed mode."


def test_answer_random_question_uses_stored_mapping(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Let chance decide?",
            "sender_id": "sender-6",
            "mode": "random",
        },
        headers=QUESTION_HEADERS,
    )
    question_id = create_response.json()["question_id"]
    option_map = questions[question_id].option_map
    assert option_map is not None

    response = client.post(
        "/answer",
        json={
            "question_id": question_id,
            "user_id": "receiver-6",
            "user_choice": "A",
        },
    )

    assert response.status_code == 200
    assert response.json()["answer"] == option_map["A"]
    assert questions[question_id].answer == option_map["A"]


def test_answer_random_question_rejects_yes_no_choice(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Let chance decide?",
            "sender_id": "sender-random-invalid",
            "mode": "random",
        },
        headers=QUESTION_HEADERS,
    )

    response = client.post(
        "/answer",
        json={
            "question_id": create_response.json()["question_id"],
            "user_id": "receiver-random-invalid",
            "user_choice": "YES",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "user_choice must be A or B for random mode."


def test_answer_fixed_question_rejects_a_b_choice(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Keep fixed behavior strict?",
            "sender_id": "sender-fixed-invalid",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )

    response = client.post(
        "/answer",
        json={
            "question_id": create_response.json()["question_id"],
            "user_id": "receiver-fixed-invalid",
            "user_choice": "A",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "user_choice must be YES or NO for fixed mode."


def test_already_answered_question_returns_400(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Only answer once?",
            "sender_id": "sender-7",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )
    question_id = create_response.json()["question_id"]

    first_response = client.post(
        "/answer",
        json={
            "question_id": question_id,
            "user_id": "receiver-7",
            "user_choice": "NO",
        },
    )
    second_response = client.post(
        "/answer",
        json={
            "question_id": question_id,
            "user_id": "receiver-8",
            "user_choice": "YES",
        },
    )

    assert first_response.status_code == 200
    assert second_response.status_code == 400
    assert second_response.json()["detail"] == "Question has already been answered."


def test_expired_question_returns_400(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Will this expire?",
            "sender_id": "sender-8",
            "mode": "fixed",
        },
        headers=QUESTION_HEADERS,
    )
    question_id = create_response.json()["question_id"]
    questions[question_id] = questions[question_id].model_copy(
        update={"expires_at": utc_now() - timedelta(minutes=1)}
    )

    response = client.post(
        "/answer",
        json={
            "question_id": question_id,
            "user_id": "receiver-8",
            "user_choice": "YES",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Question has expired."


def test_question_requires_user_header(client, monkeypatch):
    monkeypatch.setattr(rate_limiter_module, "redis_client", FakeRedisClient())

    response = client.post(
        "/question",
        json={
            "text": "Missing header?",
            "sender_id": "sender-9",
            "mode": "fixed",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Missing x-user-id header."


def test_question_rate_limit_returns_429_after_100_requests(client, monkeypatch):
    fake_redis = FakeRedisClient()
    monkeypatch.setattr(rate_limiter_module, "redis_client", fake_redis)

    payload = {
        "text": "Rate limit me.",
        "sender_id": "sender-10",
        "mode": "fixed",
    }

    for _ in range(100):
        response = client.post("/question", json=payload, headers=_question_headers("rate-user"))
        assert response.status_code == 200

    limited_response = client.post("/question", json=payload, headers=_question_headers("rate-user"))

    assert limited_response.status_code == 429
    assert limited_response.json()["detail"] == "Too many requests"
    assert limited_response.headers["Retry-After"] == "60"
    assert fake_redis.expiry_calls == [("rate_limit:rate-user", 60)]


def test_question_rate_limit_is_tracked_per_user(client, monkeypatch):
    fake_redis = FakeRedisClient()
    monkeypatch.setattr(rate_limiter_module, "redis_client", fake_redis)

    payload = {
        "text": "Different users.",
        "sender_id": "sender-11",
        "mode": "fixed",
    }

    for _ in range(100):
        response = client.post("/question", json=payload, headers=_question_headers("user-a"))
        assert response.status_code == 200

    other_user_response = client.post("/question", json=payload, headers=_question_headers("user-b"))

    assert other_user_response.status_code == 200
    assert fake_redis.counts["rate_limit:user-a"] == 100
    assert fake_redis.counts["rate_limit:user-b"] == 1


def test_question_rate_limiter_returns_503_when_redis_fails(client, monkeypatch):
    fake_redis = FakeRedisClient()
    fake_redis.raise_error = True
    monkeypatch.setattr(rate_limiter_module, "redis_client", fake_redis)

    response = client.post(
        "/question",
        json={
            "text": "Redis down?",
            "sender_id": "sender-12",
            "mode": "fixed",
        },
        headers=_question_headers("redis-error-user"),
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Rate limiter unavailable."
