import { useNavigate, useLocation } from "react-router-dom";
import "./FloatingChatButton.css";

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on certain pages
  const hiddenPaths = ["/student/chatbot", "/login", "/admin"];
  const shouldHide = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHide) return null;

  return (
    <button
      className="floating-chat-button"
      onClick={() => navigate("/student/chatbot")}
      aria-label="Open Philosopher AI Assistant"
    >
      <div className="pulse-ring"></div>
      <div className="pulse-ring pulse-ring-delay"></div>
      <div className="button-icon">
        <span className="phi-symbol">Φ</span>
      </div>
      <div className="chat-tooltip">
        Philosopher
        <span className="tooltip-features">Translate • Summarize • Chat</span>
      </div>
      <span className="notification-badge">3</span>
    </button>
  );
}
