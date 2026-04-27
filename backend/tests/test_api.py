def test_create_question(client):
    response = client.post(
        "/question",
        json={"sender_id": "sender-123", "text": "Should I move forward?"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["question"]["sender_id"] == "sender-123"
    assert data["question"]["status"] == "pending"
    assert data["question"]["answer"] is None
    assert data["share_url"].endswith(f"/answer/{data['question']['id']}")
    assert data["result_url"].endswith(f"/result/{data['question']['id']}")


def test_get_question_not_found(client):
    response = client.get("/question/missing-id")

    assert response.status_code == 404
    assert response.json()["detail"] == "Question not found."


def test_submit_answer_updates_question(client):
    create_response = client.post(
        "/question",
        json={"sender_id": "sender-123", "text": "Is this working?"},
    )
    question_id = create_response.json()["question"]["id"]

    answer_response = client.post(
        "/answer",
        json={"question_id": question_id, "receiver_id": "receiver-456", "answer": "yes"},
    )

    assert answer_response.status_code == 200
    data = answer_response.json()["question"]
    assert data["receiver_id"] == "receiver-456"
    assert data["answer"] == "yes"
    assert data["status"] == "answered"


def test_submit_answer_rejects_second_answer(client):
    create_response = client.post(
        "/question",
        json={"sender_id": "sender-123", "text": "Try a second answer?"},
    )
    question_id = create_response.json()["question"]["id"]

    first_response = client.post(
        "/answer",
        json={"question_id": question_id, "receiver_id": "receiver-1", "answer": "no"},
    )
    second_response = client.post(
        "/answer",
        json={"question_id": question_id, "receiver_id": "receiver-2", "answer": "yes"},
    )

    assert first_response.status_code == 200
    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Question has already been answered."


def test_question_text_cannot_be_blank(client):
    response = client.post(
        "/question",
        json={"sender_id": "sender-123", "text": "   "},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "Question text cannot be empty."


def test_sender_receives_websocket_update(client):
    create_response = client.post(
        "/question",
        json={"sender_id": "sender-123", "text": "Will the socket fire?"},
    )
    question = create_response.json()["question"]

    with client.websocket_connect(f"/ws/{question['sender_id']}") as websocket:
        answer_response = client.post(
            "/answer",
            json={
                "question_id": question["id"],
                "receiver_id": "receiver-456",
                "answer": "yes",
            },
        )

        message = websocket.receive_json()

    assert answer_response.status_code == 200
    assert message["type"] == "question_answered"
    assert message["question"]["id"] == question["id"]
    assert message["question"]["answer"] == "yes"
