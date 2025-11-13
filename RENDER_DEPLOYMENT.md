# Render Deployment Guide

## Prerequisites

- A Render account (https://render.com)
- Your GitHub repository connected to Render

## Services to Deploy

### 1. Spring Boot Backend (Students/Universities Service)

**Service Type**: Web Service
**Build Command**: (Docker build)
**Start Command**: (Automatic from Dockerfile)
**Port**: 8081

**Environment Variables** (set in Render dashboard):

```
SERVER_PORT=8081
SPRING_DATASOURCE_URL=<your-postgres-url>
SPRING_DATASOURCE_USERNAME=<db-username>
SPRING_DATASOURCE_PASSWORD=<db-password>
```

**Steps**:

1. New Web Service → Connect Repository
2. Select `Backend_spring` directory
3. Runtime: Docker
4. Add environment variables above
5. Deploy

---

### 2. GraphQL Server

**Service Type**: Web Service
**Build Command**: (Docker build)
**Start Command**: (Automatic from Dockerfile)
**Port**: 9000

**Environment Variables**:

```
PORT=9000
STUDENT_BASE=<spring-backend-url>/api
COURSE_BASE=<django-backend-url>/api
AI_BASE=<chatbot-service-url>/api
NODE_ENV=production
```

**Steps**:

1. New Web Service → Connect Repository
2. Select `graphql` directory
3. Runtime: Docker
4. Add environment variables (use Render service URLs)
5. Deploy

---

### 3. Spring Cloud Gateway

**Service Type**: Web Service
**Build Command**: (Docker build)
**Start Command**: (Automatic from Dockerfile)
**Port**: 9091

**Environment Variables**:

```
SERVER_PORT=9091
GRAPHQL_SERVICE_URL=<graphql-service-url>/graphql
STUDENT_SERVICE_URL=<spring-backend-url>
COURSE_SERVICE_URL=<django-backend-url>
CHATBOT_SERVICE_URL=<chatbot-service-url>
```

**Steps**:

1. New Web Service → Connect Repository
2. Select `Gateaway` directory
3. Runtime: Docker
4. Add environment variables (use Render service URLs)
5. Deploy

---

## Deployment Order

1. **First**: Deploy Spring Backend (needs database first)
2. **Second**: Deploy Django Backend & Chatbot (if not already deployed)
3. **Third**: Deploy GraphQL Server (needs backend URLs)
4. **Fourth**: Deploy Gateway (needs GraphQL URL)
5. **Last**: Deploy Frontend (needs Gateway URL)

## Testing Local Docker Builds

Before deploying to Render, test locally:

### Spring Backend

```powershell
cd Backend_spring
docker build -t spring-backend .
docker run -p 8081:8081 spring-backend
```

### GraphQL Server

```powershell
cd graphql
docker build -t graphql-server .
docker run -p 9000:9000 `
  -e STUDENT_BASE=http://localhost:8081/api `
  -e COURSE_BASE=http://localhost:9090/api `
  -e AI_BASE=http://localhost:8002/api `
  graphql-server
```

### Gateway

```powershell
cd Gateaway
docker build -t gateway .
docker run -p 9091:9091 `
  -e GRAPHQL_SERVICE_URL=http://localhost:9000/graphql `
  gateway
```

## Important Notes

1. **Database**: You'll need to create a PostgreSQL database on Render for the Spring Backend
2. **Service URLs**: After each service deploys, Render gives you a URL like `https://service-name.onrender.com`
3. **Update URLs**: Update environment variables with actual Render service URLs
4. **CORS**: Make sure CORS settings allow your frontend domain
5. **Health Checks**: Render will ping your services. Make sure `/health` endpoints work

## Render Service URLs Pattern

- Spring Backend: `https://your-spring-backend.onrender.com`
- GraphQL: `https://your-graphql.onrender.com`
- Gateway: `https://your-gateway.onrender.com`

Use these URLs in environment variables for other services!
