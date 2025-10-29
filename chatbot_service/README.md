# AI Chatbot Service

Django-based microservice for AI-powered text translation and summarization.

## Features

- **Text Translation**: Translate text between languages using Hugging Face models
- **Text Summarization**: Generate concise summaries of long texts
- **REST API**: Easy-to-use REST endpoints

## Technology Stack

- Django 4.2
- Django REST Framework
- Hugging Face Transformers
- PyTorch

## Installation
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver 8002
```

## API Endpoints

### 1. Translate Text
**POST** `/api/translate/`
```json
{
  "text": "Hello, how are you?",
  "source_lang": "en",
  "target_lang": "fr"
}
```

### 2. Summarize Text
**POST** `/api/summarize/`
```json
{
  "text": "Long text to summarize...",
  "max_length": 130,
  "min_length": 30
}
```

### 3. Health Check
**GET** `/api/health/`

## Running the Service
```bash
python manage.py runserver 8002
```

The service will be available at `http://localhost:8002`

## Integration with API Gateway

Configure your Spring Cloud Gateway to route requests:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: chatbot-service
          uri: http://localhost:8002
          predicates:
            - Path=/chatbot/**
          filters:
            - StripPrefix=1
```