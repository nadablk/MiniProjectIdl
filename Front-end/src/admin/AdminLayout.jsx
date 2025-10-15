import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./style/AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Top Navigation Bar */}
      <header className="admin-header">
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
                <path
                  d="M20 8 L20 32 M14 14 L26 14 M14 20 L26 20 M14 26 L26 26"
                  stroke="#603B28"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text
                  x="20"
                  y="25"
                  fontSize="16"
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
            <span className="system-subtitle">
              University Management System
            </span>
          </div>

          <nav className="main-nav">
            <Link
              to="/admin/dashboard"
              className={`nav-link ${isActive("/admin/dashboard")}`}
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </Link>
            <Link
              to="/admin/students"
              className={`nav-link ${isActive("/admin/students")}`}
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Students
            </Link>
            <Link
              to="/admin/universities"
              className={`nav-link ${isActive("/admin/universities")}`}
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18"></path>
                <path d="M3 10h18"></path>
                <path d="M5 6l7-3 7 3"></path>
                <path d="M4 10v11"></path>
                <path d="M20 10v11"></path>
                <path d="M8 14v3"></path>
                <path d="M12 14v3"></path>
                <path d="M16 14v3"></path>
              </svg>
              Universities
            </Link>
            <Link
              to="/admin/courses"
              className={`nav-link ${isActive("/admin/courses")}`}
            >
              <svg
                className="nav-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Courses
            </Link>
          </nav>

          <div className="user-section">
            <div className="user-info">
              <svg
                className="user-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="user-name">{user?.name || "Admin"}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
