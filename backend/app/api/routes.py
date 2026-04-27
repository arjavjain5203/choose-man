from fastapi import APIRouter, status

from app.models.question import (
    AnswerQuestionRequest,
    AnswerQuestionResponse,
    CreateQuestionRequest,
    CreateQuestionResponse,
    Question,
)
from app.services.question_service import answer_question, create_question, get_question

router = APIRouter()


@router.post("/question", response_model=CreateQuestionResponse, status_code=status.HTTP_200_OK)
async def create_question_route(payload: CreateQuestionRequest) -> CreateQuestionResponse:
    return await create_question(payload)


@router.get("/question/{question_id}", response_model=Question, status_code=status.HTTP_200_OK)
async def get_question_route(question_id: str) -> Question:
    return await get_question(question_id)


@router.post("/answer", response_model=AnswerQuestionResponse, status_code=status.HTTP_200_OK)
async def answer_question_route(payload: AnswerQuestionRequest) -> AnswerQuestionResponse:
    return await answer_question(payload)
