import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatbotGraphQL } from "../services/graphqlApi";
import "./Chatbot.css";

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Philosopher AI! I can help you translate text and summarize course content. Select a mode above to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("translate"); // 'translate', 'summarize'
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const result = await chatbotGraphQL.translate(
        input,
        sourceLanguage,
        targetLanguage
      );

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Translation (${result.sourceLang} → ${result.targetLang}): ${result.translatedText}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${result.error || "Translation failed"}`,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error translating: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleSummarize = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const result = await chatbotGraphQL.summarize(input);

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Summary (${result.originalLength} → ${result.summaryLength} chars):\n\n${result.summary}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${result.error || "Summarization failed"}`,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error summarizing: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === "translate") {
      handleTranslate();
    } else if (mode === "summarize") {
      handleSummarize();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <header className="chatbot-header">
        <button className="back-btn" onClick={() => navigate("/student/home")}>
          ← Back
        </button>
        <div className="chatbot-title">
          <svg width="40" height="40" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="24"
              fill="#E8DCCC"
              stroke="#603b28"
              strokeWidth="2"
            />
            <text
              x="25"
              y="35"
              textAnchor="middle"
              fontSize="28"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fill="#603b28"
            >
              Φ
            </text>
          </svg>
          <h1>Philosopher AI</h1>
        </div>
        <div></div>
      </header>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === "translate" ? "active" : ""}`}
          onClick={() => setMode("translate")}
        >
          🌐 Translate
        </button>
        <button
          className={`mode-btn ${mode === "summarize" ? "active" : ""}`}
          onClick={() => setMode("summarize")}
        >
          📝 Summarize
        </button>
      </div>

      {/* Language Selection (only for translate mode) */}
      {mode === "translate" && (
        <div className="language-selector">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
          </select>
          <span className="arrow">→</span>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "translate"
              ? "Enter text to translate..."
              : mode === "summarize"
              ? "Enter text to summarize..."
              : "Select a mode above to start..."
          }
          rows={3}
          className="chat-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={loading || !input.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
