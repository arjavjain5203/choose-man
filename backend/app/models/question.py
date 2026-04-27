from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


AnswerValue = Literal["YES", "NO"]
QuestionMode = Literal["fixed", "random"]
QuestionStatus = Literal["pending", "answered"]


class Question(BaseModel):
    id: str
    sender_id: str
    receiver_id: str | None = None
    text: str
    mode: QuestionMode
    answer: AnswerValue | None = None
    status: QuestionStatus
    expires_at: datetime


class CreateQuestionRequest(BaseModel):
    text: str = Field(min_length=1)
    sender_id: str = Field(min_length=1)
    mode: QuestionMode

    @field_validator("text", "sender_id")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Field cannot be empty.")
        return stripped


class CreateQuestionResponse(BaseModel):
    question_id: str


class AnswerQuestionRequest(BaseModel):
    question_id: str = Field(min_length=1)
    user_id: str = Field(min_length=1)
    user_choice: AnswerValue | None = None

    @field_validator("question_id", "user_id")
    @classmethod
    def validate_required_ids(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Field cannot be empty.")
        return stripped


class AnswerQuestionResponse(BaseModel):
    answer: AnswerValue
