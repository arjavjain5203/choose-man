from app.core.connection_manager import connection_manager


def test_sender_receives_answer_over_websocket(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Will this notify instantly?",
            "sender_id": "sender-live",
            "mode": "fixed",
        },
    )
    question_id = create_response.json()["question_id"]

    with client.websocket_connect("/ws/sender-live") as websocket:
        answer_response = client.post(
            "/answer",
            json={
                "question_id": question_id,
                "user_id": "receiver-live",
                "user_choice": "YES",
            },
        )

        message = websocket.receive_json()

    assert answer_response.status_code == 200
    assert message == {
        "type": "answer",
        "question_id": question_id,
        "answer": "YES",
    }


def test_answer_succeeds_when_sender_not_connected(client):
    create_response = client.post(
        "/question",
        json={
            "text": "Should silent failure work?",
            "sender_id": "offline-sender",
            "mode": "fixed",
        },
    )
    question_id = create_response.json()["question_id"]

    response = client.post(
        "/answer",
        json={
            "question_id": question_id,
            "user_id": "receiver-offline",
            "user_choice": "NO",
        },
    )

    assert response.status_code == 200
    assert response.json() == {"answer": "NO"}
    assert "offline-sender" not in connection_manager.active_connections
