# 🤖 AI Chatbot Integration Guide

## 📚 Overview

This chatbot UI is designed to work with a **Django backend** using **Hugging Face Transformers** for:

- 🌍 **Translation** - Translate text to different languages
- 📝 **Summarization** - Condense long texts into key points
- 💬 **Chat** - General conversation and assistance

---

## 🎨 UI Features

### ✅ Implemented

- Modern, gradient design with animations
- 3 modes: Translate, Summarize, Chat
- Real-time typing indicators
- Message bubbles with timestamps
- Quick action chips
- Floating chat button (visible on all student pages)
- Responsive design (mobile-friendly)
- Smooth animations and transitions

### 🎯 Floating Button

- Appears on all student pages (home, courses)
- Hidden on admin pages and login
- Animated pulse effect
- Notification badge (customizable)
- Hover tooltip

---

## 🔌 API Integration

### Step 1: Create Django Chatbot API

Create a new Django app for the chatbot:

```bash
cd backend
python manage.py startapp chatbot
```

### Step 2: Install Dependencies

```bash
pip install transformers torch sentencepiece sacremoses
```

### Step 3: Create Django Views

**backend/chatbot/views.py:**

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import pipeline

# Initialize models (do this once at startup)
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-fr")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class TranslateView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        target_lang = request.data.get('target_lang', 'fr')  # default French

        if not text:
            return Response(
                {'error': 'No text provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Translate text
            result = translator(text, max_length=512)
            translated_text = result[0]['translation_text']

            return Response({
                'original': text,
                'translated': translated_text,
                'target_language': target_lang
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SummarizeView(APIView):
    def post(self, request):
        text = request.data.get('text', '')

        if not text:
            return Response(
                {'error': 'No text provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Summarize text
            summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
            summarized_text = summary[0]['summary_text']

            return Response({
                'original': text,
                'summary': summarized_text,
                'original_length': len(text.split()),
                'summary_length': len(summarized_text.split())
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatView(APIView):
    def post(self, request):
        message = request.data.get('message', '')

        if not message:
            return Response(
                {'error': 'No message provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Simple echo for now (replace with actual chatbot model)
            response_text = f"I received your message: {message}. How can I help you?"

            return Response({
                'message': message,
                'response': response_text
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### Step 4: Create URLs

**backend/chatbot/urls.py:**

```python
from django.urls import path
from .views import TranslateView, SummarizeView, ChatView

urlpatterns = [
    path('translate/', TranslateView.as_view(), name='translate'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('chat/', ChatView.as_view(), name='chat'),
]
```

**backend/course_service/urls.py:**

```python
urlpatterns = [
    # ... existing urls
    path('api/chatbot/', include('chatbot.urls')),
]
```

### Step 5: Add to INSTALLED_APPS

**backend/course_service/settings.py:**

```python
INSTALLED_APPS = [
    # ... existing apps
    'chatbot',
]
```

---

## 🔧 Frontend Integration

### Update Chatbot.jsx

Replace the `getSimulatedResponse` function with actual API calls:

```javascript
// Add this at the top of Chatbot.jsx
const CHATBOT_API_BASE_URL = "http://192.168.117.225:8080/api/chatbot";

const handleSendMessage = async () => {
  if (!inputText.trim()) return;

  // Add user message
  const userMessage = {
    id: Date.now(),
    type: "user",
    text: inputText,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  const currentInput = inputText;
  setInputText("");
  setIsTyping(true);

  try {
    let response;

    // Call different API based on active tab
    if (activeTab === "translate") {
      response = await fetch(`${CHATBOT_API_BASE_URL}/translate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentInput, target_lang: "fr" }),
      });
    } else if (activeTab === "summarize") {
      response = await fetch(`${CHATBOT_API_BASE_URL}/summarize/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentInput }),
      });
    } else {
      response = await fetch(`${CHATBOT_API_BASE_URL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
    }

    const data = await response.json();

    // Format response based on type
    let botText = "";
    if (activeTab === "translate") {
      botText = `🌍 Translation:\n\n"${data.original}"\n\n→ ${data.target_language}: "${data.translated}"`;
    } else if (activeTab === "summarize") {
      botText = `📝 Summary:\n\n${data.summary}\n\n(Reduced from ${data.original_length} to ${data.summary_length} words)`;
    } else {
      botText = data.response;
    }

    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      text: botText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = {
      id: Date.now() + 1,
      type: "bot",
      text: "Sorry, I encountered an error. Please try again.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};
```

---

## 🚀 Gateway Configuration

Add chatbot routes to the API Gateway:

**Gateaway/src/main/resources/application.properties:**

```properties
# Chatbot routes
spring.cloud.gateway.mvc.routes[5].id=django-chatbot
spring.cloud.gateway.mvc.routes[5].uri=http://192.168.117.225:9090
spring.cloud.gateway.mvc.routes[5].predicates[0]=Path=/api/chatbot/**
```

---

## 📊 Testing

### Test Translation

```bash
curl -X POST http://localhost:8080/api/chatbot/translate/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "target_lang": "fr"}'
```

### Test Summarization

```bash
curl -X POST http://localhost:8080/api/chatbot/summarize/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Long text here..."}'
```

### Test Chat

```bash
curl -X POST http://localhost:8080/api/chatbot/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "What is philosophy?"}'
```

---

## 🎯 Advanced Features (Optional)

### 1. Multi-Language Translation

```python
# Support multiple target languages
TRANSLATION_MODELS = {
    'fr': 'Helsinki-NLP/opus-mt-en-fr',
    'es': 'Helsinki-NLP/opus-mt-en-es',
    'de': 'Helsinki-NLP/opus-mt-en-de',
}
```

### 2. Conversation History

```python
# Store chat history in database
class ChatHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

### 3. Rate Limiting

```python
# Add rate limiting to prevent abuse
from rest_framework.throttling import UserRateThrottle

class ChatRateThrottle(UserRateThrottle):
    rate = '100/hour'
```

---

## 📁 File Structure

```
backend/
└── chatbot/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── tests.py

Front-end/
├── src/
│   ├── pages/
│   │   └── Chatbot.jsx          ✅ Created
│   ├── components/
│   │   ├── FloatingChatButton.jsx   ✅ Created
│   │   └── FloatingChatButton.css   ✅ Created
│   └── style/
│       └── Chatbot.css          ✅ Created
```

---

## ✅ Summary

**UI Components Created:**

1. ✅ Chatbot page with modern design
2. ✅ Floating chat button
3. ✅ 3 modes: Translate, Summarize, Chat
4. ✅ Responsive design
5. ✅ Routes configured

**Next Steps:**

1. Create Django chatbot app
2. Install Hugging Face Transformers
3. Implement API endpoints
4. Update frontend with API calls
5. Configure Gateway routes
6. Test end-to-end

**The UI is ready!** Students will love the modern, interactive design! 🎉
