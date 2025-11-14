# Django Backend Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 9090

# Run migrations and start server with gunicorn
CMD sh -c "echo 'Running migrations...' && \
python manage.py migrate --noinput && \
echo 'Migrations complete. Starting gunicorn...' && \
gunicorn course_service.wsgi:application --bind 0.0.0.0:9090 --workers 2 --timeout 120 --access-logfile - --error-logfile - --log-level debug"
