# 🚀 Quick Start - Running All Services

## Complete Startup Sequence

Run these commands in **separate PowerShell terminals**:

### Terminal 1: Spring Boot Backend (Students & Universities)

```powershell
cd "Backend_spring"
mvn spring-boot:run
```

✅ Running on: `http://localhost:8081`

---

### Terminal 2: Django Backend (Courses & Enrollments)

```powershell
cd backend
python manage.py runserver 0.0.0.0:9090
```

✅ Running on: `http://localhost:9090`

---

### Terminal 3: Chatbot Service (AI Translation & Summarization)

```powershell
cd chatbot_service

# First time only: Install dependencies
pip install -r requirements.txt

# First time only: Run migrations
python manage.py migrate

# Start the service
python manage.py runserver 8002
```

✅ Running on: `http://localhost:8002`

**Note:** First run may take 2-3 minutes to download AI models from Hugging Face.

---

### Terminal 4: API Gateway (Routing Layer)

```powershell
cd Gateaway
mvn spring-boot:run
```

✅ Running on: `http://localhost:8080`

---

### Terminal 5: Frontend (React Application)

```powershell
cd Front-end

# First time only: Install dependencies
npm install

# Start development server
npm run dev
```

✅ Running on: `http://localhost:5173`

---

## ✅ Verify All Services

### Quick Health Check Commands

```powershell
# Spring Boot
curl http://localhost:8081/api/students

# Django (Courses)
curl http://localhost:9090/api/courses

# Chatbot Service
curl http://localhost:8002/api/health/

# Gateway (all-in-one)
curl http://localhost:8080/api/students
curl http://localhost:8080/api/courses
curl http://localhost:8080/api/chatbot/health/
```

All should return JSON responses! ✅

---

## 🌐 Access Points

### For Testing on Same Machine:

- Frontend: `http://localhost:5173`
- Gateway: `http://localhost:8080`

### For Testing on Network:

- Frontend: `http://192.168.117.225:5173`
- Gateway: `http://192.168.117.225:8080`

_(Replace IP with your machine's network IP)_

---

## 🎯 What Each Service Does

| Service            | Port | Purpose                                  |
| ------------------ | ---- | ---------------------------------------- |
| **Spring Boot**    | 8081 | Students & Universities (GraphQL + REST) |
| **Django Courses** | 9090 | Courses & Enrollments (GraphQL + REST)   |
| **Django Chatbot** | 8002 | AI Translation & Summarization           |
| **API Gateway**    | 8080 | Single entry point, routes all requests  |
| **React Frontend** | 5173 | User interface (students & admin)        |

---

## 🔥 Common Issues

### "Address already in use"

**Problem:** Port is occupied

**Solution:**

```powershell
# Find process using port (example: 8080)
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### "Module not found" (Python)

**Problem:** Missing dependencies

**Solution:**

```powershell
pip install -r requirements.txt
```

### "Connection refused" (Frontend)

**Problem:** Gateway not running or wrong IP

**Solution:**

1. Check Gateway is running: `curl http://localhost:8080`
2. Verify IP in `Front-end/src/config/apiConfig.js`

---

## 🎉 Test the Complete Flow

1. **Start all 5 services** (wait until each shows "running")

2. **Open browser:** `http://localhost:5173`

3. **Login as Student:**

   - Username: (your test student)
   - Password: (your test password)

4. **Test Features:**

   - ✅ View courses (via Django GraphQL)
   - ✅ Click Φ button → Chatbot opens
   - ✅ Translate tab: Type "Hello world" → See translation
   - ✅ Summarize tab: Paste long text → See summary

5. **Login as Admin:**
   - ✅ View students (via Spring Boot GraphQL)
   - ✅ View universities (via Spring Boot GraphQL)
   - ✅ Manage courses (via Django GraphQL)
   - ✅ Manage enrollments (via Django GraphQL)

All working? **You're ready to go!** 🚀

---

## 📝 Startup Order (Important!)

**Best practice:** Start services in this order:

1. Backend services first (Spring Boot, Django, Chatbot)
2. Wait until all backends show "Started"
3. Start Gateway
4. Wait for Gateway to connect to backends
5. Start Frontend last

This ensures Gateway can connect to all backend services properly.

---

## 🛑 Shutdown

Press `Ctrl + C` in each terminal window to stop services gracefully.

---

## 💡 Pro Tips

### Quick Restart All Services (PowerShell script)

Create a file `start-all.ps1`:

```powershell
# Start all services in separate windows

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Backend_spring'; mvn spring-boot:run"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; python manage.py runserver 0.0.0.0:9090"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'chatbot_service'; python manage.py runserver 8002"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Gateaway'; mvn spring-boot:run"

Start-Sleep -Seconds 10  # Wait for backends

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Front-end'; npm run dev"
```

Run with:

```powershell
.\start-all.ps1
```

---

## 📊 Service Dependencies

```
Frontend (5173)
    │
    └─► Gateway (8080)
            ├─► Spring Boot (8081)
            ├─► Django Courses (9090)
            └─► Django Chatbot (8002)
```

If Gateway fails to start, check that all backend services are running first!

---

## ✅ Ready Checklist

Before saying "it's working":

- [ ] Spring Boot responds to `curl http://localhost:8081/api/students`
- [ ] Django responds to `curl http://localhost:9090/api/courses`
- [ ] Chatbot responds to `curl http://localhost:8002/api/health/`
- [ ] Gateway responds to `curl http://localhost:8080/api/chatbot/health/`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Can login successfully
- [ ] Chatbot button appears (Φ icon)
- [ ] Chatbot translation works
- [ ] Chatbot summarization works
- [ ] No errors in browser console (F12)

All checked? **Perfect!** You're fully operational! 🎊
