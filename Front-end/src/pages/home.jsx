import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="student-home">
      {/* Header */}
      <header className="student-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="#E8DCCC"
                  stroke="#E8DCCC"
                  strokeWidth="2"
                />
                <text
                  x="20"
                  y="27"
                  fontSize="20"
                  fontWeight="bold"
                  fill="#603B28"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                >
                  Φ
                </text>
              </svg>
            </div>
            <h1 className="system-name">Philosophe</h1>
          </div>

          <nav className="student-nav">
            <a href="#" className="nav-link active">
              Home
            </a>
            <a href="#" className="nav-link">
              My Courses
            </a>
          </nav>

          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.name || "Student"}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="student-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome, {user?.name || "Student"}!</h2>
          <p>Student ID: {user?.studentId || "N/A"}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="student-dashboard">
          {/* My Courses */}
          <div className="dashboard-card courses-card">
            <div className="card-header">
              <h3>My Courses</h3>
              <span className="badge">5 courses</span>
            </div>
            <div className="courses-list">
              <div className="course-item">
                <div className="course-icon">📖</div>
                <div className="course-info">
                  <h4>Modern Philosophy</h4>
                  <p>Prof. Dr. Marie Lambert</p>
                </div>
                <span className="course-status ongoing">Ongoing</span>
              </div>
              <div className="course-item">
                <div className="course-icon">📚</div>
                <div className="course-info">
                  <h4>History of Philosophy</h4>
                  <p>Prof. Dr. John Martin</p>
                </div>
                <span className="course-status ongoing">Ongoing</span>
              </div>
              <div className="course-item">
                <div className="course-icon">🎓</div>
                <div className="course-info">
                  <h4>Ethics and Morality</h4>
                  <p>Prof. Dr. Sophie Bernard</p>
                </div>
                <span className="course-status ongoing">Ongoing</span>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="dashboard-card announcements-card">
            <div className="card-header">
              <h3>Announcements</h3>
            </div>
            <div className="announcements-list">
              <div className="announcement-item">
                <span className="announcement-icon">📢</span>
                <div className="announcement-content">
                  <h4>Student Body Meeting</h4>
                  <p>October 15, 2025 - 2:00 PM, Conference Room A</p>
                </div>
              </div>
              <div className="announcement-item">
                <span className="announcement-icon">📝</span>
                <div className="announcement-content">
                  <h4>Registration Opens</h4>
                  <p>Winter Semester 2025 - Starting October 18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
