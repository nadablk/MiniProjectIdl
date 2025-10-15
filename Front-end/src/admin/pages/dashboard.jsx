import { useState, useEffect } from "react";
import { studentAPI } from "../../services/api";
import "../style/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: "student",
      action: "New student enrolled",
      name: "John Smith",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "course",
      action: "New course created",
      name: "Modern Philosophy",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "student",
      action: "Student updated",
      name: "Jane Doe",
      time: "1 day ago",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const studentStats = await studentAPI.getStudentStats();
      setStats({
        totalStudents: studentStats.totalStudents || 0,
        totalCourses: 156, // TODO: Add courses API when available
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load statistics");
      // Keep default values on error
      setStats({
        totalStudents: 0,
        totalCourses: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview of Philosophe System</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card students">
          <svg
            className="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div className="stat-content">
            <h3 className="stat-value">
              {loading ? "..." : stats.totalStudents.toLocaleString()}
            </h3>
            <p className="stat-label">Students</p>
          </div>
          <div className="stat-trend positive">+12% this month</div>
        </div>

        <div className="stat-card courses">
          <svg
            className="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <div className="stat-content">
            <h3 className="stat-value">
              {loading ? "..." : stats.totalCourses}
            </h3>
            <p className="stat-label">Courses</p>
          </div>
          <div className="stat-trend neutral">+8 this semester</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Activities */}
        <div className="dashboard-card activities-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === "student" && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  {activity.type === "course" && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  )}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-name">{activity.name}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <svg
                className="action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
              <span className="action-label">Add Student</span>
            </button>
            <button className="quick-action-btn">
              <svg
                className="action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="10" y1="9" x2="14" y2="9"></line>
                <line x1="12" y1="7" x2="12" y2="11"></line>
              </svg>
              <span className="action-label">Create Course</span>
            </button>
            <button className="quick-action-btn">
              <svg
                className="action-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="action-label">Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
