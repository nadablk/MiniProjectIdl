import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseGraphQL, enrollmentGraphQL } from "../services/graphqlApi";
import FloatingChatButton from "../components/FloatingChatButton";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("philosophe_user"));
    if (userData) {
      setUser(userData);
      // Use studentId from userData, not id
      const studentId = userData.studentId || userData.id;
      if (studentId) {
        loadData(studentId);
      } else {
        setError("Student ID not found in user data");
        setLoading(false);
      }
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, []);

  const loadData = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading data for student ID:", studentId);
      const [allCourses, studentEnrollments] = await Promise.all([
        courseGraphQL.getAllCourses(),
        enrollmentGraphQL.getEnrollmentsByStudent(studentId),
      ]);
      console.log("Courses loaded:", allCourses);
      console.log("Enrollments loaded:", studentEnrollments);
      setCourses(allCourses);
      setEnrollments(studentEnrollments);
    } catch (error) {
      console.error("Error loading data:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        studentId,
      });
      setError(
        error.message ||
          "Failed to load data. Please check if all services are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isEnrolled = (courseId) => {
    return enrollments.some((e) => e.course === courseId);
  };

  const getEnrollmentGrade = (courseId) => {
    const enrollment = enrollments.find((e) => e.course === courseId);
    return enrollment?.grade || "N/A";
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (showOnlyEnrolled) {
      return matchesSearch && isEnrolled(course.id);
    }
    return matchesSearch;
  });

  const enrolledCount = enrollments.length;
  const availableCount = courses.length;

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button
            onClick={() => loadData(user?.studentId || user?.id)}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Professional Header with Phi Logo */}
      <header className="home-header">
        <div className="logo-container">
          <svg width="50" height="50" viewBox="0 0 50 50">
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
          <div className="header-title-group">
            <h1>Philosopher</h1>
            <span className="header-subtitle">Learning Management System</span>
          </div>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || "S"}
            </div>
            <div className="user-details">
              <span className="user-name">
                {user?.firstName || "Student"} {user?.lastName || ""}
              </span>
              <span className="user-role">Student</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">⎋</span> Logout
          </button>
        </div>
      </header>

      {/* Hero Section with Gradient */}
      <div className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Your Learning Dashboard</h2>
          <p className="hero-subtitle">
            Master new skills, track your progress, and achieve your academic
            goals
          </p>
        </div>

        {/* Stats Cards in Hero */}
        <div className="stats-container">
          <div className="stat-card stat-card-enrolled">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">📚</div>
            </div>
            <div className="stat-info">
              <h3>{enrolledCount}</h3>
              <p>Enrolled Courses</p>
              <div className="stat-progress">
                <div
                  className="stat-progress-bar"
                  style={{
                    width: `${(enrolledCount / availableCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-available">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">🎓</div>
            </div>
            <div className="stat-info">
              <h3>{availableCount}</h3>
              <p>Available Courses</p>
              <div className="stat-progress">
                <div
                  className="stat-progress-bar full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-progress">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">📊</div>
            </div>
            <div className="stat-info">
              <h3>
                {enrolledCount > 0
                  ? Math.round((enrolledCount / availableCount) * 100)
                  : 0}
                %
              </h3>
              <p>Completion Rate</p>
              <div className="stat-progress">
                <div
                  className="stat-progress-bar"
                  style={{
                    width: `${(enrolledCount / availableCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Control Bar */}
        <div className="control-bar">
          <div className="control-bar-left">
            <h2 className="section-title">Course Catalog</h2>
            <span className="results-count">
              {filteredCourses.length} courses
            </span>
          </div>

          <div className="control-bar-right">
            {/* Navigation Toggle */}
            <div className="navigation-toggle">
              <button
                className={`toggle-btn ${showOnlyEnrolled ? "active" : ""}`}
                onClick={() => setShowOnlyEnrolled(true)}
              >
                <span className="toggle-icon">📖</span> My Courses
              </button>
              <button
                className={`toggle-btn ${!showOnlyEnrolled ? "active" : ""}`}
                onClick={() => setShowOnlyEnrolled(false)}
              >
                <span className="toggle-icon">🌐</span> All Courses
              </button>
            </div>

            {/* Search Box */}
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-section">
          {filteredCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or view all available courses</p>
              {showOnlyEnrolled && (
                <button
                  className="empty-action-btn"
                  onClick={() => setShowOnlyEnrolled(false)}
                >
                  Browse All Courses
                </button>
              )}
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card ${
                    isEnrolled(course.id) ? "enrolled" : ""
                  }`}
                >
                  <div className="course-card-header">
                    <div className="course-card-top">
                      <h3>{course.name}</h3>
                      {isEnrolled(course.id) && (
                        <span className="enrolled-badge">
                          <span className="badge-icon">✓</span> Enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-footer">
                    <div className="course-meta">
                      <span className="course-credits">
                        <span className="meta-icon">📖</span>
                        {course.credits} Credits
                      </span>
                      {isEnrolled(course.id) && (
                        <span className="course-grade">
                          <span className="meta-icon">⭐</span>
                          Grade: {getEnrollmentGrade(course.id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingChatButton />
    </div>
  );
}
