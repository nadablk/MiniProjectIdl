# 🚀 Complete Startup Guide - GraphQL Unified Gateway

## ✅ What's Been Set Up

### GraphQL Service (Port 9000)

A unified GraphQL gateway that consolidates all backend APIs into a single endpoint.

**Location:** `graphql/` folder

**Features:**

- ✅ Single GraphQL endpoint for all operations
- ✅ Aggregates Spring Boot, Django, and Chatbot APIs
- ✅ Schema-based (not REST endpoints)
- ✅ Resolvers that call backend REST APIs
- ✅ CORS enabled for frontend

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend (React - Port 5173)            │
│                                                 │
│  Uses: http://localhost:9000/graphql          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│     GraphQL Service (Port 9000) ⭐ NEW!         │
│                                                 │
│  Schema: schema.graphqls                       │
│  Resolvers: StudentUniversityResolver          │
│            CourseEnrollmentResolver            │
│            ChatbotResolver                     │
│                                                 │
│  Clients: SpringBootClient → Port 8081        │
│          DjangoClient → Port 9090              │
│          ChatbotClient → Port 8002             │
└────┬──────────────┬──────────────┬─────────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌───────────┐  ┌────────────┐
│ Spring  │  │  Django   │  │  Chatbot   │
│  Boot   │  │  Courses  │  │  Service   │
│  :8081  │  │   :9090   │  │   :8002    │
└─────────┘  └───────────┘  └────────────┘
```

---

## 🎯 Complete Startup Sequence

### Step 1: Start Backend Services (4 terminals)

#### Terminal 1: Spring Boot (Students & Universities)

```powershell
cd "c:\Users\DELL 7540\Desktop\mini projet IDL\Backend_spring"
mvn spring-boot:run
```

✅ Wait for: "Started ProjectApplication"

#### Terminal 2: Django Courses (Courses & Enrollments)

```powershell
cd "c:\Users\DELL 7540\Desktop\mini projet IDL\backend"
python manage.py runserver 9090
```

✅ Wait for: "Starting development server at http://127.0.0.1:9090/"

#### Terminal 3: Chatbot Service (Translation & Summarization)

```powershell
cd "c:\Users\DELL 7540\Desktop\mini projet IDL\chatbot_service"
python manage.py runserver 8002
```

✅ Wait for: "Starting development server at http://127.0.0.1:8002/"

#### Terminal 4: GraphQL Service ⭐ NEW!

```powershell
cd "c:\Users\DELL 7540\Desktop\mini projet IDL\graphql"
mvn spring-boot:run
```

✅ Wait for: "Started GraphqlApplication"
✅ Service on: `http://localhost:9000`

### Step 2: Start Frontend (Terminal 5)

```powershell
cd "c:\Users\DELL 7540\Desktop\mini projet IDL\Front-end"
npm run dev
```

✅ Open: `http://localhost:5173`

---

## 🧪 Testing the GraphQL Service

### Option 1: GraphiQL Interface

Open browser: `http://localhost:9000/graphiql`

Try this query:

```graphql
query {
  allStudents {
    id
    name
    email
  }
  allCourses {
    id
    name
    description
  }
}
```

### Option 2: Frontend Testing

1. Open `http://localhost:5173`
2. Login as admin
3. Navigate to Students page → Should load students
4. Navigate to Courses page → Should load courses
5. Navigate to Universities page → Should load universities

---

## 📝 What Changed in Frontend

### Before (Old Setup):

```javascript
// Frontend had to call 2 different GraphQL endpoints
SPRING_GRAPHQL: "http://localhost:9091/graphql/spring";
DJANGO_GRAPHQL: "http://localhost:9091/graphql/django";
```

### After (New Setup): ⭐

```javascript
// Frontend now calls a SINGLE GraphQL endpoint
GRAPHQL_ENDPOINT: "http://localhost:9000/graphql";
```

### Files Updated:

- ✅ `Front-end/src/config/apiConfig.js` - Added GRAPHQL_ENDPOINT
- ✅ `Front-end/src/services/graphqlApi.js` - Uses single endpoint

---

## 🗂️ GraphQL Service Files

### Configuration

- `src/main/resources/application.properties` - Port 9000, backend URLs

### Schema

- `src/main/resources/graphql/schema.graphqls` - GraphQL schema with all types

### Resolvers (GraphQL Query/Mutation Handlers)

- `src/main/java/graphql/graphql/resolver/StudentUniversityResolver.java`
- `src/main/java/graphql/graphql/resolver/CourseEnrollmentResolver.java`
- `src/main/java/graphql/graphql/resolver/ChatbotResolver.java`

### HTTP Clients (Backend Communication)

- `src/main/java/graphql/graphql/client/SpringBootClient.java`
- `src/main/java/graphql/graphql/client/DjangoClient.java`
- `src/main/java/graphql/graphql/client/ChatbotClient.java`

### Configuration

- `src/main/java/graphql/graphql/config/CorsConfig.java` - CORS settings

---

## ⚠️ Important Notes

### 1. Gateway vs GraphQL Service

- **Gateway (Port 9091)**: Still exists for REST APIs and routing
- **GraphQL Service (Port 9000)**: NEW! Unified GraphQL endpoint only

### 2. Startup Order Matters

```
1. Spring Boot → 2. Django → 3. Chatbot → 4. GraphQL Service → 5. Frontend
```

### 3. Backend Services Must Run

GraphQL service will fail if backends aren't running because it proxies requests to them.

---

## 🐛 Troubleshooting

### GraphQL Service Won't Start

**Error**: "Address already in use"
**Solution**: Port 9000 is taken

```powershell
netstat -ano | findstr :9000
taskkill /PID <PID> /F
```

### "Connection refused" in GraphQL Service

**Problem**: Backend services not running
**Solution**: Start Spring Boot, Django, and Chatbot first

### Frontend Shows GraphQL Errors

**Problem**: GraphQL service not running
**Solution**:

```powershell
cd graphql
mvn spring-boot:run
```

### Maven Build Fails

**Problem**: Missing dependencies
**Solution**:

```powershell
cd graphql
mvn clean install
mvn spring-boot:run
```

---

## 🎉 Success Checklist

Before testing frontend:

- [ ] Spring Boot running on 8081
- [ ] Django running on 9090
- [ ] Chatbot running on 8002
- [ ] **GraphQL service running on 9000** ⭐ NEW!
- [ ] Frontend running on 5173

Test GraphQL:

- [ ] Open `http://localhost:9000/graphiql`
- [ ] Try query: `{ allStudents { id name } }`
- [ ] Should see student data

Test Frontend:

- [ ] Open `http://localhost:5173`
- [ ] Login as admin
- [ ] Students page loads
- [ ] Courses page loads
- [ ] Universities page loads
- [ ] No GraphQL errors in console

---

## 📚 Additional Resources

- **GraphQL Schema**: `graphql/src/main/resources/graphql/schema.graphqls`
- **GraphQL Service README**: `graphql/README.md`
- **Frontend Config**: `Front-end/src/config/apiConfig.js`

---

## 🎯 Key Benefits of This Setup

1. **Single GraphQL Endpoint**: Frontend only needs to know one URL
2. **Schema-Based**: Type-safe queries defined in schema.graphqls
3. **Aggregation**: Combines data from 3 different backends
4. **Resolver Pattern**: Clean separation of concerns
5. **Easy to Extend**: Add new resolvers for new features

---

**Everything is ready! Start the services in order and enjoy your unified GraphQL API!** 🚀
