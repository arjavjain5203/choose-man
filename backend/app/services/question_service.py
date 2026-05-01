from datetime import datetime, timedelta, timezone
import random
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.connection_manager import connection_manager
from app.db.storage import questions
from app.models.question import (
    AnswerQuestionRequest,
    AnswerQuestionResponse,
    CreateQuestionRequest,
    CreateQuestionResponse,
    Question,
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


async def create_question(payload: CreateQuestionRequest) -> CreateQuestionResponse:
    question_id = str(uuid4())
    option_map = None
    if payload.mode == "random":
        option_map = random.choice(
            [
                {"A": "YES", "B": "NO"},
                {"A": "NO", "B": "YES"},
            ]
        )

    question = Question(
        id=question_id,
        sender_id=payload.sender_id,
        receiver_id=None,
        text=payload.text,
        mode=payload.mode,
        answer=None,
        option_map=option_map,
        status="pending",
        expires_at=utc_now() + timedelta(hours=1),
    )
    questions[question_id] = question
    return CreateQuestionResponse(question_id=question_id)


async def get_question(question_id: str) -> Question:
    question = questions.get(question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )
    return question


async def answer_question(payload: AnswerQuestionRequest) -> AnswerQuestionResponse:
    question = questions.get(payload.question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    if utc_now() > question.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question has expired.",
        )

    if question.answer is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question has already been answered.",
        )

    if question.mode == "fixed":
        if payload.user_choice is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="user_choice is required for fixed mode.",
            )
        if payload.user_choice not in {"YES", "NO"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="user_choice must be YES or NO for fixed mode.",
            )
        resolved_answer = payload.user_choice
    else:
        if payload.user_choice is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="user_choice is required for random mode.",
            )
        if payload.user_choice not in {"A", "B"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="user_choice must be A or B for random mode.",
            )
        if question.option_map is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Question option map is missing.",
            )
        resolved_answer = question.option_map[payload.user_choice]

    updated_question = question.model_copy(
        update={
            "receiver_id": payload.user_id,
            "answer": resolved_answer,
            "status": "answered",
        }
    )
    questions[payload.question_id] = updated_question

    await connection_manager.send_to_user(
        updated_question.sender_id,
        {
            "type": "answer",
            "question_id": updated_question.id,
            "answer": updated_question.answer,
        },
    )

    return AnswerQuestionResponse(answer=updated_question.answer)
