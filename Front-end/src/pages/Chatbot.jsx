import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Chatbot.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "👋 Welcome! I'm Philosopher, your AI learning assistant.",
      timestamp: new Date(),
    },
    {
      id: 2,
      type: "bot",
      text: "I can help you with:\n\n🌍 Translate texts to different languages\n📝 Summarize long passages\n💬 Answer your academic questions",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("translate"); // translate, summarize, chat
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    setInputText("");
    setIsTyping(true);

    // TODO: Replace with actual API call to Django backend
    // Simulate API response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: getSimulatedResponse(activeTab, inputText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simulated responses (will be replaced with actual API)
  const getSimulatedResponse = (tab, text) => {
    switch (tab) {
      case "translate":
        return `🌍 Translation:\n\n"${text}"\n\n→ French: "Bonjour, comment allez-vous?"\n→ Spanish: "Hola, ¿cómo estás?"\n→ German: "Hallo, wie geht es dir?"`;
      case "summarize":
        return `📝 Summary:\n\nYour text has been condensed to its key points:\n\n• Main idea: ${text.substring(
          0,
          50
        )}...\n• Key points extracted\n• Simplified for better understanding`;
      case "chat":
        return `💬 I understand you said: "${text}"\n\nHow can I assist you further with this?`;
      default:
        return "I'm here to help!";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        text: "Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const quickActions = [
    { icon: "🌍", text: "Translate to French", action: "translate" },
    { icon: "📝", text: "Summarize this", action: "summarize" },
    { icon: "💡", text: "Explain concept", action: "chat" },
    { icon: "🔍", text: "Search info", action: "chat" },
  ];

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="bot-avatar">
            <div className="avatar-icon">Φ</div>
            <div className="online-indicator"></div>
          </div>
          <div className="bot-info">
            <h1>Philosopher</h1>
            <p className="bot-status">
              <span className="status-dot"></span> AI Learning Assistant
            </p>
          </div>
        </div>
        <div className="header-right">
          <button
            className="header-action-btn"
            onClick={handleClearChat}
            title="Clear chat"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${activeTab === "translate" ? "active" : ""}`}
          onClick={() => setActiveTab("translate")}
        >
          <span className="mode-icon">🌍</span>
          Translate
        </button>
        <button
          className={`mode-btn ${activeTab === "summarize" ? "active" : ""}`}
          onClick={() => setActiveTab("summarize")}
        >
          <span className="mode-icon">📝</span>
          Summarize
        </button>
        <button
          className={`mode-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <span className="mode-icon">💬</span>
          Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === "bot" ? "Φ" : "👤"}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">Φ</div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-chip"
              onClick={() => {
                setInputText(action.text);
                setActiveTab(action.action);
              }}
            >
              <span>{action.icon}</span>
              {action.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <button className="input-action-btn" title="Attach file">
            📎
          </button>
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder={`Type your ${
              activeTab === "translate"
                ? "text to translate"
                : activeTab === "summarize"
                ? "text to summarize"
                : "message"
            }...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button className="input-action-btn" title="Voice input">
            🎤
          </button>
          <button
            className={`send-btn ${inputText.trim() ? "active" : ""}`}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <p className="input-hint">
          Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
