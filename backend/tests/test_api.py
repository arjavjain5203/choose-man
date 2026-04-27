from datetime import timedelta

from app.db.storage import questions
from app.services.question_service import utc_now


def test_create_fixed_question(client):
    response = client.post(
        "/question",
        json={
            "text": "Should I decide now?",
            "sender_id": "sender-1",
            "mode": "fixed",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert "question_id" in payload

    stored_question = questions[payload["question_id"]]
    assert stored_question.receiver_id is None
    assert stored_question.answer is None
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
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["question_id"] in questions


def test_get_question_returns_full_object(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Can I fetch this?",
            "sender_id": "sender-3",
            "mode": "fixed",
        },
    )

    question_id = create_response.json()["question_id"]
    response = client.get(f"/question/{question_id}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == question_id
    assert payload["text"] == "Can I fetch this?"
    assert payload["status"] == "pending"


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


def test_answer_random_question_ignores_choice(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Let chance decide?",
            "sender_id": "sender-6",
            "mode": "random",
        },
    )

    response = client.post(
        "/answer",
        json={
            "question_id": create_response.json()["question_id"],
            "user_id": "receiver-6",
            "user_choice": "YES",
        },
    )

    assert response.status_code == 200
    assert response.json()["answer"] in {"YES", "NO"}


def test_already_answered_question_returns_400(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Only answer once?",
            "sender_id": "sender-7",
            "mode": "fixed",
        },
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
