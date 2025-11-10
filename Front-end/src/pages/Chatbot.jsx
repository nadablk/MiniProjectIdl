import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatbotGraphQL } from "../services/graphqlApi";
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
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
  ];

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
    const messageText = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      let botResponse = "";

      // Call appropriate API based on active tab
      if (activeTab === "translate") {
        const result = await chatbotGraphQL.translate(
          messageText,
          sourceLang,
          targetLang
        );

        if (result.success) {
          const sourceLangName =
            languages.find((l) => l.code === sourceLang)?.name ||
            sourceLang.toUpperCase();
          const targetLangName =
            languages.find((l) => l.code === targetLang)?.name ||
            targetLang.toUpperCase();

          botResponse = `🌍 Translation Results:\n\n📝 Original (${sourceLangName}):\n"${result.originalText}"\n\n✨ Translated (${targetLangName}):\n"${result.translatedText}"`;
        } else {
          botResponse = `❌ Translation Error: ${result.error}\n\nPlease try again or contact support if the issue persists.`;
        }
      } else if (activeTab === "summarize") {
        const result = await chatbotGraphQL.summarize(messageText);

        if (result.success) {
          botResponse = `📝 Summary:\n\n✨ Condensed Text:\n"${
            result.summary
          }"\n\n📊 Stats:\n• Original: ${
            result.originalLength
          } words\n• Summary: ${
            result.summaryLength
          } words\n• Reduction: ${Math.round(
            (1 - result.summaryLength / result.originalLength) * 100
          )}%`;
        } else {
          botResponse = `❌ Summarization Error: ${result.error}\n\nPlease try again or contact support if the issue persists.`;
        }
      } else if (activeTab === "chat") {
        // Chat mode - for now, echo back with helpful message
        botResponse = `💬 Chat Mode:\n\nYou said: "${messageText}"\n\nNote: Full conversational AI is coming soon! For now, please use the Translation or Summarization features.`;
      }

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: `❌ Error: Failed to process your request. Please check if the chatbot service is running.\n\nError details: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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

      {/* Language Selector (only for translate mode) */}
      {activeTab === "translate" && (
        <div className="language-selector">
          <div className="language-group">
            <label htmlFor="source-lang">From:</label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="language-dropdown"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="arrow-icon">→</div>
          <div className="language-group">
            <label htmlFor="target-lang">To:</label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="language-dropdown"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
