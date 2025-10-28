import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FloatingChatButton.css";

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show on chatbot page itself or login page
  const hiddenPaths = ["/chatbot", "/login", "/admin"];
  const shouldShow = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!shouldShow) return null;

  const handleClick = () => {
    navigate("/chatbot");
  };

  return (
    <div className="floating-chat-container">
      <button
        className={`floating-chat-btn ${isHovered ? "hovered" : ""}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Philosopher AI Assistant"
      >
        <div className="btn-content">
          <span className="chat-icon">Φ</span>
          <span className="pulse-ring"></span>
          <span className="pulse-ring-2"></span>
        </div>
      </button>

      {/* Tooltip */}
      <div className={`chat-tooltip ${isHovered ? "visible" : ""}`}>
        <p className="tooltip-title">Philosopher</p>
        <p className="tooltip-text">Translate • Summarize • Chat</p>
      </div>

      {/* Notification Badge (optional) */}
      <span className="notification-badge">1</span>
    </div>
  );
};

export default FloatingChatButton;
