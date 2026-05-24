import httpx
import asyncio
import time

async def test_rate_limit(user_id, count=120):
    url = "http://localhost:8000/question"
    headers = {"x-user-id": user_id}
    payload = {
        "text": "Rate limit test question",
        "sender_id": user_id,
        "mode": "fixed"
    }
    
    results = []
    print(f"Sending {count} requests for user {user_id}...")
    
    async with httpx.AsyncClient() as client:
        for i in range(count):
            try:
                response = await client.post(url, json=payload, headers=headers)
                results.append(response.status_code)
                if i % 20 == 0:
                    print(f"Progress: {i}/{count}")
            except Exception as e:
                print(f"Error at request {i}: {e}")
                results.append(None)
                
    success_count = results.count(200)
    rate_limit_count = results.count(429)
    other_count = len(results) - success_count - rate_limit_count
    
    print(f"\nResults for {user_id}:")
    print(f"200 OK: {success_count}")
    print(f"429 Too Many Requests: {rate_limit_count}")
    print(f"Other: {other_count}")
    
    return results

async def main():
    # Test 1: Single user hitting limit
    user_1 = "user-1-test"
    await test_rate_limit(user_1)
    
    # Test 2: Multi-user independence
    user_2 = "user-2-test"
    print("\nTesting user 2 independence...")
    await test_rate_limit(user_2, 50) # Should all be 200

if __name__ == "__main__":
    asyncio.run(main())
