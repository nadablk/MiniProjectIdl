# Chatbot Service Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create directory for model cache
RUN mkdir -p /app/models_cache

# Set Hugging Face cache directory
ENV TRANSFORMERS_CACHE=/app/models_cache
ENV HF_HOME=/app/models_cache

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8002

# Run migrations and start server with gunicorn
CMD sh -c "set -e && \
echo '[1/3] Starting chatbot service...' && \
python manage.py check && \
echo '[2/3] Running migrations...' && \
python manage.py migrate --noinput || true && \
echo '[3/3] Starting gunicorn server on 0.0.0.0:8002' && \
exec gunicorn chatbot_config.wsgi:application --bind 0.0.0.0:8002 --workers 2 --timeout 120 --access-logfile - --error-logfile - --log-level info"
