# GraphQL API Gateway# GraphQL Unified Gateway

A unified GraphQL API gateway that aggregates multiple microservices:## Overview

- **Student Service** (Spring Boot - port 8081)

- **Course Service** (Django - port 9090)This is a unified GraphQL gateway that consolidates all APIs from:

- **AI/Chatbot Service** (port 8002)

- **Spring Boot** (Students & Universities) - Port 8081

## Setup- **Django** (Courses & Enrollments) - Port 9090

- **Chatbot Service** (Translation & Summarization) - Port 8002

1. Install dependencies:

```bash## Architecture

npm install

```

Frontend (Port 5173)

2. Configure environment variables in `.env`: ↓

````envGraphQL Service (Port 9000) ← **YOU ARE HERE**

STUDENT_BASE=http://localhost:8081    ├→ Spring Boot (Port 8081)

COURSE_BASE=http://localhost:9090/api    ├→ Django (Port 9090)

AI_BASE=http://localhost:8002    └→ Chatbot (Port 8002)

PORT=9000```

````

## Quick Start

3. Start the server:

````bash### 1. Start Backend Services First

npm start

```Make sure all backend services are running:



For development with auto-reload:```powershell

```bash# Terminal 1: Spring Boot

npm run devcd Backend_spring

```mvn spring-boot:run



## Access# Terminal 2: Django Courses

cd backend

- GraphQL Playground: http://localhost:9000python manage.py runserver 9090

- Health Check: Query `chatbotHealth`

# Terminal 3: Chatbot

## Example Queriescd chatbot_service

python manage.py runserver 8002

### Get All Students```

```graphql

query {### 2. Start GraphQL Service

  allStudents {

    id```powershell

    namecd graphql

    emailmvn spring-boot:run

    university {```

      id

      nameService will start on: `http://localhost:9000`

      location

    }### 3. Test GraphQL

  }

}Open GraphiQL interface: `http://localhost:9000/graphiql`

````

## Example Queries

### Get All Courses

````graphql### Get All Students

query {

  allCourses {```graphql

    idquery {

    name  allStudents {

    description    id

    instructor    name

    category    email

    credits    university {

  }      id

}      name

```    }

  }

### Create Course}

```graphql```

mutation {

  createCourse(input: {### Get All Courses

    name: "Introduction to GraphQL"

    description: "Learn GraphQL basics"```graphql

    instructor: "John Doe"query {

    category: "CS"  allCourses {

    credits: 3    id

  }) {    name

    id    description

    name  }

    instructor}

  }```

}

```### Translate Text



### Add Student to Course```graphql

```graphqlmutation {

mutation {  translate(text: "Hello world", sourceLang: "en", targetLang: "fr") {

  addStudentToCourse(input: {    success

    student_id: 1    translatedText

    course: 1    originalText

    status: "ENROLLED"  }

  }) {}

    id```

    student_id

    course {### Summarize Text

      id

      name```graphql

    }mutation {

    status  summarize(text: "Long text here...", maxLength: 130, minLength: 30) {

  }    success

}    summary

```    originalLength

    summaryLength
  }
}
````

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
