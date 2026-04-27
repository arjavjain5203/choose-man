from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class QuestionStatus(str, Enum):
    PENDING = "pending"
    ANSWERED = "answered"


class AnswerOption(str, Enum):
    YES = "yes"
    NO = "no"


class Question(BaseModel):
    id: str
    sender_id: str
    receiver_id: str | None = None
    text: str
    answer: AnswerOption | None = None
    status: QuestionStatus


class CreateQuestionRequest(BaseModel):
    sender_id: str = Field(min_length=1)
    text: str = Field(min_length=1, max_length=280)


class CreateQuestionResponse(BaseModel):
    question: Question
    share_url: str
    result_url: str


class GetQuestionResponse(BaseModel):
    question: Question


class SubmitAnswerRequest(BaseModel):
    question_id: str = Field(min_length=1)
    receiver_id: str = Field(min_length=1)
    answer: Literal["yes", "no"]


class SubmitAnswerResponse(BaseModel):
    question: Question
