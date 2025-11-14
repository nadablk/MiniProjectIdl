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

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Running migrations..."\n\
python manage.py migrate --noinput\n\
echo "Migrations complete. Starting server..."\n\
gunicorn course_service.wsgi:application --bind 0.0.0.0:9090 --workers 4' > /app/start.sh && \
chmod +x /app/start.sh

# Expose port
EXPOSE 9090

# Run startup script
CMD ["/app/start.sh"]
