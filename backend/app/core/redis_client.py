try:
    from redis import Redis
except ImportError:  # pragma: no cover - exercised indirectly in environments without redis installed
    Redis = None


class MissingRedisClient:
    def incr(self, _key: str) -> int:
        raise RuntimeError("Redis client is unavailable.")

    def expire(self, _key: str, _seconds: int) -> bool:
        raise RuntimeError("Redis client is unavailable.")


if Redis is None:
    redis_client = MissingRedisClient()
else:
    redis_client = Redis(
        host="localhost",
        port=6379,
        decode_responses=True,
        socket_connect_timeout=1,
        socket_timeout=1,
    )
