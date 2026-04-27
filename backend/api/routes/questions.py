from fastapi import APIRouter

from core.config import get_settings
from models.question import (
    CreateQuestionRequest,
    CreateQuestionResponse,
    GetQuestionResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from services.question_service import create_question, get_question, submit_answer

router = APIRouter(tags=["questions"])


@router.post("/question", response_model=CreateQuestionResponse)
async def create_question_route(payload: CreateQuestionRequest) -> CreateQuestionResponse:
    settings = get_settings()
    return await create_question(payload, settings.frontend_base_url)


@router.get("/question/{question_id}", response_model=GetQuestionResponse)
async def get_question_route(question_id: str) -> GetQuestionResponse:
    question = await get_question(question_id)
    return GetQuestionResponse(question=question)


@router.post("/answer", response_model=SubmitAnswerResponse)
async def submit_answer_route(payload: SubmitAnswerRequest) -> SubmitAnswerResponse:
    question = await submit_answer(payload)
    return SubmitAnswerResponse(question=question)
