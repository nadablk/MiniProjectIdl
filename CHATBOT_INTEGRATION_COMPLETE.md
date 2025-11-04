# 🤖 Chatbot Service Integration Guide

## Overview

The AI Chatbot Service has been successfully integrated into your application! It provides:

- 🌍 **Text Translation** - Translate between languages using AI
- 📝 **Text Summarization** - Condense long texts into summaries
- 💬 **Chat Interface** - Beautiful student-facing chatbot UI

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   Student Pages     │
│  (Chatbot.jsx)      │
│                     │
│  - Translate Mode   │
│  - Summarize Mode   │
│  - Chat Mode        │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │ (chatbotApi.js)
           ▼
┌─────────────────────────────────────────┐
│        API Gateway (Port 8080)          │
│                                         │
│  Routes:                                │
│  /api/chatbot/translate/** ──► Django  │
│  /api/chatbot/summarize/** ──► Django  │
│  /api/chatbot/health/** ───────► Django │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   Chatbot Service (Django - Port 8002) │
│                                         │
│  - Translation API (Hugging Face)      │
│  - Summarization API (Transformers)    │
│  - Health Check                        │
└─────────────────────────────────────────┘
```

---

## 📁 Files Added/Modified

### **Gateway Configuration**

**File:** `Gateaway/src/main/resources/application.properties`

Added:

```properties
# Chatbot Service
chatbot.backend.url=http://localhost:8002

# Routes
spring.cloud.gateway.mvc.routes[6].id=chatbot-translate
spring.cloud.gateway.mvc.routes[6].uri=${chatbot.backend.url}
spring.cloud.gateway.mvc.routes[6].predicates[0]=Path=/api/chatbot/translate/**
spring.cloud.gateway.mvc.routes[6].filters[0]=StripPrefix=2

spring.cloud.gateway.mvc.routes[7].id=chatbot-summarize
spring.cloud.gateway.mvc.routes[7].uri=${chatbot.backend.url}
spring.cloud.gateway.mvc.routes[7].predicates[0]=Path=/api/chatbot/summarize/**
spring.cloud.gateway.mvc.routes[7].filters[0]=StripPrefix=2

spring.cloud.gateway.mvc.routes[8].id=chatbot-health
spring.cloud.gateway.mvc.routes[8].uri=${chatbot.backend.url}
spring.cloud.gateway.mvc.routes[8].predicates[0]=Path=/api/chatbot/health/**
spring.cloud.gateway.mvc.routes[8].filters[0]=StripPrefix=2
```

### **Frontend API Service**

**File:** `Front-end/src/services/chatbotApi.js` ✨ NEW

Provides:

- `chatbotAPI.translate(text, sourceLang, targetLang)`
- `chatbotAPI.summarize(text, maxLength, minLength)`
- `chatbotAPI.healthCheck()`

### **Frontend Component**

**File:** `Front-end/src/pages/Chatbot.jsx` ✅ UPDATED

Changed:

- ❌ Removed simulated responses
- ✅ Added real API integration
- ✅ Proper error handling
- ✅ Loading states

### **API Configuration**

**File:** `Front-end/src/config/apiConfig.js` ✅ UPDATED

Added:

- `CHATBOT_API` endpoint configuration

---

## 🚀 How to Run

### **1. Start Chatbot Service**

```powershell
# Terminal 1 - Chatbot Service
cd chatbot_service

# Install dependencies (first time only)
pip install -r requirements.txt

# Run migrations (first time only)
python manage.py migrate

# Start the service on port 8002
python manage.py runserver 8002
```

**Expected Output:**

```
Starting development server at http://127.0.0.1:8002/
```

### **2. Start Gateway**

```powershell
# Terminal 2 - API Gateway
cd Gateaway
mvn spring-boot:run
```

**Expected Output:**

```
Tomcat started on port(s): 8080 (http)
```

### **3. Start Other Services**

```powershell
# Terminal 3 - Spring Boot Backend
cd Backend_spring
mvn spring-boot:run

# Terminal 4 - Django Backend (Courses)
cd backend
python manage.py runserver 0.0.0.0:9090

# Terminal 5 - Frontend
cd Front-end
npm run dev
```

---

## 🧪 Testing the Integration

### **1. Test Chatbot Service Health**

```powershell
# Direct access (bypassing Gateway)
curl http://localhost:8002/api/health/

# Through Gateway
curl http://localhost:8080/api/chatbot/health/
```

**Expected Response:**

```json
{
  "status": "healthy",
  "service": "AI Chatbot Service",
  "version": "1.0.0"
}
```

### **2. Test Translation**

```powershell
curl -X POST http://localhost:8080/api/chatbot/translate/ `
  -H "Content-Type: application/json" `
  -d '{
    "text": "Hello, how are you?",
    "source_lang": "en",
    "target_lang": "fr"
  }'
```

**Expected Response:**

```json
{
  "original_text": "Hello, how are you?",
  "translated_text": "Bonjour, comment allez-vous?",
  "source_lang": "en",
  "target_lang": "fr"
}
```

### **3. Test Summarization**

```powershell
curl -X POST http://localhost:8080/api/chatbot/summarize/ `
  -H "Content-Type: application/json" `
  -d '{
    "text": "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents: any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals.",
    "max_length": 50,
    "min_length": 20
  }'
```

**Expected Response:**

```json
{
  "original_text": "Artificial intelligence...",
  "summary": "AI is machine intelligence, studied through intelligent agents...",
  "original_length": 50,
  "summary_length": 15
}
```

### **4. Test Frontend Integration**

1. Open browser: `http://localhost:5173`
2. Login as student
3. Click floating Φ button (bottom right)
4. **Translate Tab:**
   - Enter: "Good morning"
   - Click send
   - Should see French translation
5. **Summarize Tab:**
   - Enter a long paragraph
   - Click send
   - Should see condensed summary

---

## 📡 API Endpoints

### **Through Gateway** (Recommended)

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| POST   | `/api/chatbot/translate/` | Translate text |
| POST   | `/api/chatbot/summarize/` | Summarize text |
| GET    | `/api/chatbot/health/`    | Health check   |

### **Direct Access** (For debugging)

| Method | Endpoint                               | Description    |
| ------ | -------------------------------------- | -------------- |
| POST   | `http://localhost:8002/api/translate/` | Translate text |
| POST   | `http://localhost:8002/api/summarize/` | Summarize text |
| GET    | `http://localhost:8002/api/health/`    | Health check   |

---

## 💻 Frontend Usage

### **Import the API**

```javascript
import { chatbotAPI } from "../services/chatbotApi";
```

### **Translate Text**

```javascript
const result = await chatbotAPI.translate(
  "Hello, world!",
  "en", // Source language
  "es" // Target language
);

if (result.success) {
  console.log("Original:", result.originalText);
  console.log("Translated:", result.translatedText);
} else {
  console.error("Error:", result.error);
}
```

### **Summarize Text**

```javascript
const result = await chatbotAPI.summarize(
  "Long text to summarize...",
  130, // Max length
  30 // Min length
);

if (result.success) {
  console.log("Summary:", result.summary);
  console.log("Original words:", result.originalLength);
  console.log("Summary words:", result.summaryLength);
} else {
  console.error("Error:", result.error);
}
```

### **Health Check**

```javascript
const health = await chatbotAPI.healthCheck();

if (health.success) {
  console.log("Status:", health.status);
  console.log("Service:", health.service);
} else {
  console.error("Service unavailable:", health.error);
}
```

---

## 🔧 Configuration

### **Change Network IP**

**File:** `Front-end/src/config/apiConfig.js`

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.1.100", // 🔧 Change this
  GATEWAY_PORT: 8080,
};
```

All chatbot endpoints automatically update!

### **Change Chatbot Service Port**

If running chatbot service on different machine or port:

**File:** `Gateaway/src/main/resources/application.properties`

```properties
# Change this if chatbot service moved
chatbot.backend.url=http://192.168.1.50:8002
```

Then restart Gateway.

---

## ⚠️ Troubleshooting

### **"Connection refused" error**

**Problem:** Frontend can't reach chatbot service

**Solutions:**

1. ✅ Check chatbot service is running: `curl http://localhost:8002/api/health/`
2. ✅ Check Gateway is running: `curl http://localhost:8080/api/chatbot/health/`
3. ✅ Verify Gateway routes in `application.properties`
4. ✅ Check firewall allows port 8002

### **"Translation failed" error**

**Problem:** Hugging Face model not loaded

**Solutions:**

1. ✅ First run takes time to download models (wait 2-3 minutes)
2. ✅ Check internet connection (models download from Hugging Face)
3. ✅ Check chatbot service logs for errors
4. ✅ Verify `transformers` package installed: `pip list | grep transformers`

### **"Module not found" error**

**Problem:** Missing Python dependencies

**Solution:**

```powershell
cd chatbot_service
pip install -r requirements.txt
```

### **CORS errors**

**Problem:** Browser blocks requests

**Solutions:**

1. ✅ Verify `corsheaders` in chatbot `settings.py`
2. ✅ Check `CORS_ALLOW_ALL_ORIGINS = True` in settings
3. ✅ Restart chatbot service after changing settings

---

## 🎯 Features Overview

### **Translation**

- ✅ Multiple language pairs supported
- ✅ Powered by Hugging Face Transformers
- ✅ Fast inference with caching
- ✅ Error handling and validation

### **Summarization**

- ✅ Adjustable summary length
- ✅ Maintains key information
- ✅ Word count statistics
- ✅ Percentage reduction shown

### **Chat UI**

- ✅ Beautiful brown/cream theme (matches Philosophe)
- ✅ 3 modes: Translate, Summarize, Chat
- ✅ Message history
- ✅ Typing indicators
- ✅ Enter to send
- ✅ Auto-scroll to latest message
- ✅ Floating button for easy access

---

## 📊 Service Status

| Service         | Port | Status        | URL                     |
| --------------- | ---- | ------------- | ----------------------- |
| Chatbot Service | 8002 | ✅ Integrated | `http://localhost:8002` |
| API Gateway     | 8080 | ✅ Configured | `http://localhost:8080` |
| Frontend        | 5173 | ✅ Connected  | `http://localhost:5173` |

---

## ✅ Integration Checklist

- [x] Chatbot service created
- [x] Gateway routes configured
- [x] Frontend API service created (`chatbotApi.js`)
- [x] Chatbot UI updated to use real APIs
- [x] Error handling implemented
- [x] Network configuration centralized
- [x] Documentation complete

---

## 🎉 Ready to Use!

Your chatbot is now fully integrated! Students can:

1. Click the Φ button (bottom right)
2. Choose a mode (Translate/Summarize/Chat)
3. Type their text
4. Get AI-powered responses

All through your single API Gateway! 🚀
