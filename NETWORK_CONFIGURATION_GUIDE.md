# 🌐 Network Configuration Guide

## 📍 Where to Change IPs When Switching Networks

This guide shows you **exactly where** to change IP addresses when you switch networks or move services between machines.

---

## 🎯 Quick Reference: Files to Update

### **Frontend (React)**

| File                                | What to Change | Current Value       |
| ----------------------------------- | -------------- | ------------------- |
| `Front-end/src/config/apiConfig.js` | `GATEWAY_HOST` | `"192.168.117.225"` |

### **Gateway (Spring Cloud Gateway)**

| File                                                 | What to Change       | Current Value           |
| ---------------------------------------------------- | -------------------- | ----------------------- |
| `Gateaway/src/main/resources/application.properties` | `spring.backend.url` | `http://localhost:8081` |
| `Gateaway/src/main/resources/application.properties` | `django.backend.url` | `http://localhost:9090` |

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (React:5173)   │
│                 │
│  Change IP in:  │
│  apiConfig.js   │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────────────────────────────────────┐
│          API Gateway (Port 8080)                │
│                                                 │
│  Change Backend IPs in:                         │
│  application.properties                         │
│                                                 │
│  Routes:                                        │
│  /api/students/** ────► Spring Boot            │
│  /api/universities/** ─► Spring Boot           │
│  /api/courses/** ──────► Django                │
│  /api/enrollments/** ──► Django                │
│  /graphql/spring/** ───► Spring Boot GraphQL   │
│  /graphql/django/** ───► Django GraphQL        │
└────────┬───────────────────────┬────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Spring Boot    │    │     Django      │
│   (Port 8081)   │    │   (Port 9090)   │
│                 │    │                 │
│ Students API    │    │  Courses API    │
│ Universities    │    │  Enrollments    │
│ GraphQL         │    │  GraphQL        │
└─────────────────┘    └─────────────────┘
```

---

## 📝 Detailed Instructions

### **Scenario 1: All Services on Same Machine (Localhost)**

#### Frontend Configuration

**File:** `Front-end/src/config/apiConfig.js`

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "localhost", // ✅ Use localhost
  GATEWAY_PORT: 8080,
};
```

#### Gateway Configuration

**File:** `Gateaway/src/main/resources/application.properties`

```properties
# Backend services on same machine
spring.backend.url=http://localhost:8081
django.backend.url=http://localhost:9090
```

**Access URLs:**

- Frontend: `http://localhost:5173`
- Gateway: `http://localhost:8080`

---

### **Scenario 2: Frontend on Different Machine (Network IP)**

#### Step 1: Find Your Gateway Machine's IP Address

**Windows (PowerShell):**

```powershell
ipconfig
```

Look for: `IPv4 Address` under your active network adapter
Example: `192.168.117.225`

**Mac/Linux (Terminal):**

```bash
ifconfig
# or
ip addr show
```

Look for: `inet` under your active interface (en0, eth0, wlan0)

#### Step 2: Update Frontend Configuration

**File:** `Front-end/src/config/apiConfig.js`

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.117.225", // 🔧 CHANGE to Gateway's IP
  GATEWAY_PORT: 8080,
};
```

#### Step 3: Gateway Configuration (Backends on Same Machine as Gateway)

**File:** `Gateaway/src/main/resources/application.properties`

```properties
# Backends on same machine as Gateway
spring.backend.url=http://localhost:8081
django.backend.url=http://localhost:9090
```

**Access URLs:**

- Frontend: `http://localhost:5173` (on frontend machine)
- Gateway: `http://192.168.117.225:8080` (accessed from any machine)

---

### **Scenario 3: All Services on Different Machines**

#### Architecture:

- **Machine A:** Frontend (192.168.1.10)
- **Machine B:** Gateway (192.168.1.20)
- **Machine C:** Spring Boot (192.168.1.30)
- **Machine D:** Django (192.168.1.40)

#### Frontend Configuration (Machine A)

**File:** `Front-end/src/config/apiConfig.js`

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.1.20", // Machine B (Gateway)
  GATEWAY_PORT: 8080,
};
```

#### Gateway Configuration (Machine B)

**File:** `Gateaway/src/main/resources/application.properties`

```properties
# Spring Boot on Machine C
spring.backend.url=http://192.168.1.30:8081

# Django on Machine D
django.backend.url=http://192.168.1.40:9090
```

---

## 🔄 After Changing Configuration

### Frontend (React)

No rebuild needed! Changes are loaded on next page refresh.

### Gateway (Spring Boot)

Restart the Gateway application:

```powershell
cd Gateaway
mvn spring-boot:run
```

### Backend Services

Make sure they're listening on `0.0.0.0` (all interfaces), not just `localhost`:

**Spring Boot:** Already configured in `application.properties`

```properties
server.address=0.0.0.0
```

**Django:** Run with:

```powershell
cd backend
python manage.py runserver 0.0.0.0:9090
```

---

## 🧪 Testing Your Configuration

### 1. Test Gateway Health

```powershell
# From same machine
curl http://localhost:8080/actuator/health

# From different machine (replace IP)
curl http://192.168.117.225:8080/actuator/health
```

### 2. Test Spring Boot API through Gateway

```powershell
curl http://192.168.117.225:8080/api/students
```

### 3. Test Django API through Gateway

```powershell
curl http://192.168.117.225:8080/api/courses
```

### 4. Test GraphQL through Gateway

```powershell
# Spring GraphQL
curl -X POST http://192.168.117.225:8080/graphql/spring -H "Content-Type: application/json" -d "{\"query\":\"{ students { id firstName } }\"}"

# Django GraphQL
curl -X POST http://192.168.117.225:8080/graphql/django -H "Content-Type: application/json" -d "{\"query\":\"{ allCourses { id name } }\"}"
```

---

## 🚨 Troubleshooting

### Frontend Can't Reach Gateway

**Problem:** `ERR_CONNECTION_REFUSED` or `Network Error`

**Solutions:**

1. ✅ Check Gateway is running: `http://GATEWAY_IP:8080`
2. ✅ Check firewall allows port 8080
3. ✅ Verify `GATEWAY_HOST` in `apiConfig.js` matches Gateway machine IP
4. ✅ Ensure Gateway's `server.address=0.0.0.0` (not `localhost`)

### Gateway Can't Reach Backends

**Problem:** Gateway shows `503 Service Unavailable`

**Solutions:**

1. ✅ Check Spring Boot is running: `http://localhost:8081/api/students`
2. ✅ Check Django is running: `http://localhost:9090/api/courses`
3. ✅ Verify backend URLs in Gateway's `application.properties`
4. ✅ If backends on different machine, use network IP not `localhost`

### CORS Errors

**Problem:** Browser shows CORS policy errors

**Solutions:**

1. ✅ Check Gateway CORS configuration in `CorsConfig.java`
2. ✅ Ensure allowed origins include frontend URL
3. ✅ Clear browser cache and retry

---

## 📋 Configuration Checklist

When switching networks or moving services:

- [ ] Find new network IP addresses using `ipconfig` or `ifconfig`
- [ ] Update `Front-end/src/config/apiConfig.js` → `GATEWAY_HOST`
- [ ] Update `Gateaway/.../application.properties` → `spring.backend.url` (if Spring Boot moved)
- [ ] Update `Gateaway/.../application.properties` → `django.backend.url` (if Django moved)
- [ ] Restart Gateway application
- [ ] Restart backend services with `0.0.0.0` binding
- [ ] Test Gateway health endpoint
- [ ] Test API calls through Gateway
- [ ] Refresh frontend and test functionality

---

## 🎓 Summary

**For Quick Network Changes:**

1. Open `Front-end/src/config/apiConfig.js`
2. Change `GATEWAY_HOST` to new IP
3. Refresh browser - Done! ✅

**For Backend Service Changes:**

1. Open `Gateaway/src/main/resources/application.properties`
2. Change `spring.backend.url` or `django.backend.url`
3. Restart Gateway - Done! ✅

**Everything else stays the same!** 🎉
