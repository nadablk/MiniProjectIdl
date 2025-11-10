# Gateway Architecture Documentation

## 🏗️ Simplified Architecture Overview

```
Frontend (React - Port 5173)
    ↓
    ↓ All requests go through GraphQL
    ↓
Spring Gateway (Port 9091) ← Single Entry Point
    ↓
    └─→ /graphql → Node.js GraphQL Gateway (Port 9000)
                       ↓
                       ↓ GraphQL handles all routing internally
                       ↓
                       ├─→ Spring Boot (Port 8081) - Students & Universities
                       ├─→ Django (Port 9090) - Courses & Enrollments
                       └─→ Chatbot (Port 8002) - Translation & Summarization
```

## 📡 Service Ports

| Service                   | Port | Purpose                                            |
| ------------------------- | ---- | -------------------------------------------------- |
| **Frontend (React/Vite)** | 5173 | User Interface                                     |
| **Spring Gateway**        | 9091 | **Main Entry Point - Single route to GraphQL**     |
| **Node.js GraphQL**       | 9000 | Unified GraphQL API (handles all backend routing)  |
| **Spring Boot Backend**   | 8081 | Students & Universities (called by GraphQL)        |
| **Django Backend**        | 9090 | Courses & Enrollments (called by GraphQL)          |
| **Django Chatbot**        | 8002 | AI Translation & Summarization (called by GraphQL) |

## 🎯 Why This Simple Architecture?

### Spring Gateway Role:

- **One Route Only**: `/graphql` → `http://localhost:9000`
- **CORS Handling**: Centralized CORS for frontend
- **Single Responsibility**: Just route GraphQL traffic
- **No Business Logic**: All routing logic is in GraphQL server

### GraphQL Server Handles Everything:

- ✅ Routes to Spring Boot for Students & Universities
- ✅ Routes to Django for Courses & Enrollments
- ✅ Routes to Chatbot for AI services
- ✅ Aggregates responses from multiple services
- ✅ Provides unified schema for frontend

## 🔌 How Frontend Connects

### Configuration: `Front-end/src/config/apiConfig.js`

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "localhost",
  GATEWAY_PORT: 9091, // Spring Gateway
  GRAPHQL_PORT: 9091, // Same - routes through Gateway
};

export const API_CONFIG = {
  // Everything goes through Spring Gateway's /graphql endpoint
  GRAPHQL_ENDPOINT: `http://localhost:9091/graphql`,
};
```

### Request Flow Example

1. **Frontend** sends GraphQL query:

   ```graphql
   query {
     allStudents {
       id
       name
     }
     allCourses {
       id
       name
     }
   }
   ```

   → `POST http://localhost:9091/graphql`

2. **Spring Gateway** receives request and forwards to:
   → `POST http://localhost:9000/graphql`

3. **Node.js GraphQL** processes query:

   - Sees `allStudents` → calls `http://localhost:8081/api/students`
   - Sees `allCourses` → calls `http://localhost:9090/api/courses`
   - Aggregates both responses

4. **Node.js GraphQL** returns combined result to Gateway

5. **Spring Gateway** returns final response to Frontend

## 🚀 Starting All Services

### Required Startup Order:

1. **Backend Services** (can start in parallel):

   ```bash
   # Terminal 1: Spring Boot (Students & Universities)
   cd Backend_spring
   mvn spring-boot:run
   # Running on port 8081

   # Terminal 2: Django (Courses & Enrollments)
   cd backend
   python manage.py runserver 9090
   # Running on port 9090

   # Terminal 3: Django Chatbot (AI Services)
   cd chatbot_service
   python manage.py runserver 8002
   # Running on port 8002
   ```

2. **GraphQL Gateway** (after backends are ready):

   ```bash
   # Terminal 4: Node.js GraphQL Gateway
   cd graphql
   npm start
   # Running on port 9000
   ```

3. **Spring Gateway** (after GraphQL is ready):

   ```bash
   # Terminal 5: Spring Cloud Gateway
   cd Gateaway
   mvn spring-boot:run
   # Running on port 9091
   ```

4. **Frontend** (after Gateway is ready):
   ```bash
   # Terminal 6: React Frontend
   cd Front-end
   npm run dev
   # Running on port 5173
   ```

### Quick Start Script (PowerShell)

Save as `start-all-services.ps1`:

```powershell
# Start all services in separate terminals

# Backend services
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend_spring; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python manage.py runserver 9090"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd chatbot_service; python manage.py runserver 8002"

# Wait for backends to start
Start-Sleep -Seconds 10

# GraphQL Gateway
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd graphql; npm start"

# Wait for GraphQL
Start-Sleep -Seconds 5

# Spring Gateway
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Gateaway; mvn spring-boot:run"

# Wait for Gateway
Start-Sleep -Seconds 10

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Front-end; npm run dev"

Write-Host "All services starting..."
Write-Host "Frontend will be available at: http://localhost:5173"
Write-Host "Gateway available at: http://localhost:9091"
Write-Host "GraphQL available at: http://localhost:9000"
```

## 🧪 Testing the Connection

### 1. Test Spring Gateway Health

```bash
curl http://localhost:9091/api/students
# Should route to Spring Boot and return students
```

### 2. Test GraphQL through Gateway

```bash
curl -X POST http://localhost:9091/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ allStudents { id name } }"}'
```

### 3. Open Frontend

```
http://localhost:5173
```

## 📝 Configuration Files Updated

### 1. Spring Gateway - application.properties

- **File**: `Gateaway/src/main/resources/application.properties`
- **Simplified**: Only one backend URL variable: `graphql.gateway.url=http://localhost:9000`
- **Routes**: Only 2 routes (both for GraphQL)
  - `/graphql` → GraphQL Gateway
  - `/graphql/**` → GraphQL Gateway (with wildcards)

### 2. Spring Gateway - GatewayConfig.java

- **File**: `Gateaway/src/main/java/gateaway/cloud/config/GatewayConfig.java`
- **Simplified**: Only one constant: `GRAPHQL_GATEWAY_URL`
- **Routes**: Removed all REST API routes (students, universities, courses, enrollments, chatbot)
- **Result**: Clean, minimal configuration - only GraphQL routing

### 3. Frontend Configuration

- **File**: `Front-end/src/config/apiConfig.js`
- **No change needed**: Already using GraphQL endpoint
- **All frontend requests**: Go through GraphQL at `http://localhost:9091/graphql`

## 🔍 Troubleshooting

### Frontend can't connect to GraphQL

**Check:**

1. Is Spring Gateway running on port 9091?

   ```bash
   curl http://localhost:9091/api/students
   ```

2. Is Node.js GraphQL running on port 9000?

   ```bash
   curl http://localhost:9000/graphql -d '{"query":"{ allStudents { id } }"}'
   ```

3. Are backend services running?
   - Spring Boot: `http://localhost:8081/api/students`
   - Django: `http://localhost:9090/api/courses`
   - Chatbot: `http://localhost:8002/api/health/`

### CORS Errors

**Solution**: Spring Gateway has CORS enabled in:

- `Gateaway/src/main/java/gateaway/cloud/config/CorsConfig.java`
- Allows all origins, methods, and headers

### GraphQL Errors

**Check Node.js GraphQL logs** in Terminal 4 for detailed error messages.

## 🎉 Summary

✅ **Frontend** connects to **Spring Gateway** (9091)  
✅ **Spring Gateway** routes GraphQL to **Node.js GraphQL** (9000)  
✅ **Node.js GraphQL** aggregates all backend services  
✅ **Single entry point** for all frontend requests  
✅ **Multi-language translation** now supported  
✅ **Ready for production** with proper gateway architecture

## 📚 Architecture Benefits

1. **Separation of Concerns**: Each layer has a specific purpose
2. **Easy to Scale**: Can add more instances of any service
3. **Centralized Security**: Add auth at gateway level
4. **Better Monitoring**: Log all traffic at gateway
5. **Flexible Routing**: Change backend URLs without touching frontend
6. **API Versioning**: Can route different API versions easily
