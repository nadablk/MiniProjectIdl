import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./style/AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>🎓 Philosophe Admin</h1>
          <span className="gateway-badge">Gateway Only</span>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">👨‍💼 {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="admin-container">
        <nav className="admin-sidebar">
          <Link
            to="/admin/dashboard"
            className={`nav-item ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/admin/students"
            className={`nav-item ${
              isActive("/admin/students") ? "active" : ""
            }`}
          >
            👨‍🎓 Students
          </Link>
          <Link
            to="/admin/universities"
            className={`nav-item ${
              isActive("/admin/universities") ? "active" : ""
            }`}
          >
            🏛️ Universities
          </Link>
          <Link
            to="/admin/courses"
            className={`nav-item ${isActive("/admin/courses") ? "active" : ""}`}
          >
            📚 Courses
          </Link>
        </nav>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
