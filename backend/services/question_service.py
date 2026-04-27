from uuid import uuid4

from fastapi import HTTPException, status

from db.memory import question_store, store_lock
from models.question import (
    AnswerOption,
    CreateQuestionRequest,
    CreateQuestionResponse,
    Question,
    QuestionStatus,
    SubmitAnswerRequest,
)
from services.connection_manager import connection_manager


def _sanitize_text(text: str) -> str:
    sanitized = text.strip()
    if not sanitized:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Question text cannot be empty.",
        )
    return sanitized


async def create_question(
    payload: CreateQuestionRequest,
    frontend_base_url: str,
) -> CreateQuestionResponse:
    question_id = str(uuid4())
    question = Question(
        id=question_id,
        sender_id=payload.sender_id,
        receiver_id=None,
        text=_sanitize_text(payload.text),
        answer=None,
        status=QuestionStatus.PENDING,
    )

    async with store_lock:
        question_store[question.id] = question

    return CreateQuestionResponse(
        question=question,
        share_url=f"{frontend_base_url}/answer/{question.id}",
        result_url=f"{frontend_base_url}/result/{question.id}",
    )


async def get_question(question_id: str) -> Question:
    async with store_lock:
        question = question_store.get(question_id)

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    return question


async def submit_answer(payload: SubmitAnswerRequest) -> Question:
    async with store_lock:
        question = question_store.get(payload.question_id)
        if question is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found.",
            )

        if question.status == QuestionStatus.ANSWERED:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Question has already been answered.",
            )

        updated_question = question.model_copy(
            update={
                "receiver_id": payload.receiver_id,
                "answer": AnswerOption(payload.answer),
                "status": QuestionStatus.ANSWERED,
            }
        )
        question_store[payload.question_id] = updated_question

    await connection_manager.send_to_user(
        updated_question.sender_id,
        {"type": "question_answered", "question": updated_question.model_dump(mode="json")},
    )

    return updated_question
