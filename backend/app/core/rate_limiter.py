from fastapi import HTTPException, Request, status

from app.core.redis_client import redis_client


async def rate_limiter(request: Request) -> None:
    user_id = request.headers.get("x-user-id", "").strip()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing x-user-id header.",
        )

    key = f"rate_limit:{user_id}"

    try:
        count = redis_client.incr(key)
        if count == 1:
            redis_client.expire(key, 60)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Rate limiter unavailable.",
        ) from exc

    if count > 100:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests",
            headers={"Retry-After": "60"},
        )
