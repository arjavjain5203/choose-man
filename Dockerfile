FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FRONTEND_BASE_URL=http://localhost:8080
ENV CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend /app/backend
COPY docker/nginx-single.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /app/start.sh
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
