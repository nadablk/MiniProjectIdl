# 🧪 Testing Your API Setup

## Quick Test Commands

### 1. Find Your Current Network IP

```powershell
# Run this in PowerShell
ipconfig | Select-String "IPv4"
```

### 2. Start All Services

#### Terminal 1 - Spring Boot Backend

```powershell
cd "Backend_spring"
mvn spring-boot:run
```

**Expected:** Running on `http://localhost:8081`

#### Terminal 2 - Django Backend

```powershell
cd backend
python manage.py runserver 0.0.0.0:9090
```

**Expected:** Running on `http://0.0.0.0:9090`

#### Terminal 3 - API Gateway

```powershell
cd Gateaway
mvn spring-boot:run
```

**Expected:** Running on `http://0.0.0.0:8080`

#### Terminal 4 - Frontend

```powershell
cd Front-end
npm run dev
```

**Expected:** Running on `http://localhost:5173`

---

## 3. Test Gateway is Working

### Test from Same Machine (localhost)

```powershell
# Gateway health check
curl http://localhost:8080

# Test Spring Boot route through Gateway
curl http://localhost:8080/api/students

# Test Django route through Gateway
curl http://localhost:8080/api/courses

# Test Spring GraphQL through Gateway
curl -X POST http://localhost:8080/graphql/spring `
  -H "Content-Type: application/json" `
  -d '{"query":"{ students { id firstName lastName } }"}'

# Test Django GraphQL through Gateway
curl -X POST http://localhost:8080/graphql/django `
  -H "Content-Type: application/json" `
  -d '{"query":"{ allCourses { id name } }"}'
```

### Test from Network (other machines)

Replace `192.168.117.225` with your Gateway's IP from step 1

```powershell
# Gateway health check
curl http://192.168.117.225:8080

# Test API
curl http://192.168.117.225:8080/api/students
curl http://192.168.117.225:8080/api/courses
```

---

## 4. Test Frontend

### Open Browser and Navigate to:

- **Local:** `http://localhost:5173`
- **Network:** `http://YOUR_FRONTEND_MACHINE_IP:5173`

### Check Browser Console (F12):

- ✅ No CORS errors
- ✅ API calls going to Gateway (`http://192.168.117.225:8080` or `http://localhost:8080`)
- ✅ Data loading successfully

### Test Each Page:

1. **Home** (`/`) - Should load
2. **Courses** (`/courses`) - Should fetch courses from Django via Gateway
3. **Philosophe** (`/philosophe`) - Should load
4. **Login** (`/login`) - Should load
5. **Admin Dashboard** (`/admin/dashboard`) - Should show students/universities
6. **Admin Students** (`/admin/students`) - Should load students via GraphQL
7. **Admin Universities** (`/admin/universities`) - Should load universities via GraphQL
8. **Chatbot** (`/chatbot`) - Should load Philosopher chatbot

---

## 5. Verify API Calls in Browser

### Open Browser DevTools (F12) → Network Tab

#### Expected API Calls:

**Students Page:**

```
POST http://192.168.117.225:8080/graphql/spring
Query: { students { id firstName lastName email university { id name } } }
```

**Universities Page:**

```
POST http://192.168.117.225:8080/graphql/spring
Query: { universities { id name location students { id firstName } } }
```

**Courses Page:**

```
GET http://192.168.117.225:8080/api/courses
```

**Dashboard:**

```
POST http://192.168.117.225:8080/graphql/spring
Query: { students { ... } universities { ... } studentStats { totalStudents } }
```

---

## 6. Common Issues and Solutions

### ❌ Issue: "Failed to fetch" or "Network Error"

**Check:**

1. Is Gateway running? → `curl http://localhost:8080`
2. Is backend service running? → Check terminal output
3. Is `apiConfig.js` pointing to correct IP?
4. Is Windows Firewall blocking port 8080?

**Fix Firewall:**

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "API Gateway" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

---

### ❌ Issue: CORS Policy Error

**Check:**

- Gateway CORS configuration allows your frontend origin
- Backend services have CORS enabled

**Gateway CORS is already configured** in `CorsConfig.java` to allow all origins (development mode)

---

### ❌ Issue: 503 Service Unavailable

**Cause:** Gateway can't reach backend service

**Check:**

1. Backend is running: `curl http://localhost:8081/api/students` (Spring) or `curl http://localhost:9090/api/courses` (Django)
2. Gateway `application.properties` has correct backend URLs
3. If backends on different machine, use network IP not localhost

**Fix in Gateway `application.properties`:**

```properties
# If Spring Boot on different machine
spring.backend.url=http://192.168.x.x:8081

# If Django on different machine
django.backend.url=http://192.168.x.x:9090
```

---

### ❌ Issue: 404 Not Found

**Cause:** Route path doesn't match Gateway configuration

**Check URLs match these patterns:**

- Students: `/api/students/**`
- Universities: `/api/universities/**`
- Courses: `/api/courses/**`
- Enrollments: `/api/enrollments/**`
- Spring GraphQL: `/graphql/spring/**`
- Django GraphQL: `/graphql/django/**`

---

## 7. Success Checklist ✅

- [ ] All 4 services running (Spring, Django, Gateway, Frontend)
- [ ] Gateway responds to `curl http://localhost:8080`
- [ ] `curl http://localhost:8080/api/students` returns JSON data
- [ ] `curl http://localhost:8080/api/courses` returns JSON data
- [ ] GraphQL queries work through Gateway
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Frontend console shows no errors
- [ ] Students page loads data (via GraphQL)
- [ ] Universities page loads data (via GraphQL)
- [ ] Courses page loads data (via REST)
- [ ] Dashboard shows statistics

---

## 8. Network Testing (Optional)

### From Another Computer on Same Network:

1. **Find Gateway Machine IP:**

   ```powershell
   ipconfig
   # Note the IPv4 Address (e.g., 192.168.117.225)
   ```

2. **Update Frontend Config** (on frontend machine):

   ```javascript
   // Front-end/src/config/apiConfig.js
   export const NETWORK_CONFIG = {
     GATEWAY_HOST: "192.168.117.225", // Gateway's IP
     GATEWAY_PORT: 8080,
   };
   ```

3. **Test from Other Computer:**

   ```powershell
   curl http://192.168.117.225:8080/api/students
   ```

4. **Open Frontend:**
   - Go to `http://192.168.117.225:5173`
   - Should work exactly like localhost

---

## 🎉 Everything Working?

If all tests pass, your setup is complete! You now have:

✅ Centralized API Gateway routing all requests
✅ Spring Boot GraphQL for Students & Universities
✅ Django GraphQL for Courses & Enrollments
✅ Frontend using single Gateway endpoint
✅ Easy network configuration in one file

**Need to change network?** Just edit `Front-end/src/config/apiConfig.js` → Change `GATEWAY_HOST` → Refresh browser! 🚀
