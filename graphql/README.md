# GraphQL Unified Gateway

## Overview

This is a unified GraphQL gateway that consolidates all APIs from:

- **Spring Boot** (Students & Universities) - Port 8081
- **Django** (Courses & Enrollments) - Port 9090
- **Chatbot Service** (Translation & Summarization) - Port 8002

## Architecture

```
Frontend (Port 5173)
    ↓
GraphQL Service (Port 9000) ← **YOU ARE HERE**
    ├→ Spring Boot (Port 8081)
    ├→ Django (Port 9090)
    └→ Chatbot (Port 8002)
```

## Quick Start

### 1. Start Backend Services First

Make sure all backend services are running:

```powershell
# Terminal 1: Spring Boot
cd Backend_spring
mvn spring-boot:run

# Terminal 2: Django Courses
cd backend
python manage.py runserver 9090

# Terminal 3: Chatbot
cd chatbot_service
python manage.py runserver 8002
```

### 2. Start GraphQL Service

```powershell
cd graphql
mvn spring-boot:run
```

Service will start on: `http://localhost:9000`

### 3. Test GraphQL

Open GraphiQL interface: `http://localhost:9000/graphiql`

## Example Queries

### Get All Students

```graphql
query {
  allStudents {
    id
    name
    email
    university {
      id
      name
    }
  }
}
```

### Get All Courses

```graphql
query {
  allCourses {
    id
    name
    description
  }
}
```

### Translate Text

```graphql
mutation {
  translate(text: "Hello world", sourceLang: "en", targetLang: "fr") {
    success
    translatedText
    originalText
  }
}
```

### Summarize Text

```graphql
mutation {
  summarize(text: "Long text here...", maxLength: 130, minLength: 30) {
    success
    summary
    originalLength
    summaryLength
  }
}
```

## Configuration

### Change Port

Edit `src/main/resources/application.properties`:

```properties
server.port=9000
```

### Change Backend URLs

Edit `src/main/resources/application.properties`:

```properties
backend.spring.url=http://localhost:8081
backend.django.url=http://localhost:9090
backend.chatbot.url=http://localhost:8002
```

## Schema Location

GraphQL schema: `src/main/resources/graphql/schema.graphqls`

## Resolvers

- `StudentUniversityResolver.java` - Students & Universities
- `CourseEnrollmentResolver.java` - Courses & Enrollments
- `ChatbotResolver.java` - Translation & Summarization

## HTTP Clients

- `SpringBootClient.java` - Calls Spring Boot REST APIs
- `DjangoClient.java` - Calls Django REST APIs
- `ChatbotClient.java` - Calls Chatbot REST APIs

## Troubleshooting

### "Connection refused" errors

Make sure all backend services are running before starting GraphQL service.

### GraphQL errors

Check the terminal output for detailed error messages.

### CORS issues

CORS is configured to allow all origins. Check `CorsConfig.java` if needed.

## Frontend Integration

Frontend automatically uses this service through `apiConfig.js`:

```javascript
GRAPHQL_ENDPOINT: "http://localhost:9000/graphql";
```

All GraphQL queries from the frontend now go through this single endpoint!
