import asyncio

from models.question import Question

question_store: dict[str, Question] = {}
store_lock = asyncio.Lock()


async def reset_store() -> None:
    async with store_lock:
        question_store.clear()
