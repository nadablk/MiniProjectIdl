import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { courseAPI, enrollmentAPI } from "../services/api";
import "../style/home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterView, setFilterView] = useState("enrolled"); // 'all', 'enrolled'

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentAPI.getAllEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some((enrollment) => enrollment.course === courseId);
  };

  const getEnrollmentGrade = (courseId) => {
    const enrollment = enrollments.find((e) => e.course === courseId);
    return enrollment?.grade || "Not graded";
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterView === "all" ||
      (filterView === "enrolled" && isEnrolled(course.id));
    return matchesSearch && matchesFilter;
  });

  const enrolledCount = courses.filter((course) =>
    isEnrolled(course.id)
  ).length;

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
            <button
              className={`nav-link ${
                filterView === "enrolled" ? "active" : ""
              }`}
              onClick={() => setFilterView("enrolled")}
            >
              My Courses
            </button>
            <button
              className={`nav-link ${filterView === "all" ? "active" : ""}`}
              onClick={() => setFilterView("all")}
            >
              All Courses
            </button>
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
          <div className="welcome-text">
            <h2>Welcome, {user?.name || "Student"}!</h2>
            <p>Student ID: {user?.studentId || "N/A"}</p>
          </div>
          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-value">{enrolledCount}</span>
                <span className="stat-label">Enrolled Courses</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎓</span>
              <div className="stat-info">
                <span className="stat-value">{courses.length}</span>
                <span className="stat-label">Available Courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box-home">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Section */}
        <div className="courses-section">
          <div className="section-header">
            <h3>
              {filterView === "enrolled"
                ? "My Enrolled Courses"
                : "All Available Courses"}
            </h3>
            <span className="course-count">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📚</span>
              <h4>No courses found</h4>
              <p>
                {filterView === "enrolled"
                  ? "You are not enrolled in any courses yet."
                  : "No courses match your search."}
              </p>
            </div>
          ) : (
            <div className="courses-grid-home">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card-home ${
                    isEnrolled(course.id) ? "enrolled" : ""
                  }`}
                >
                  <div className="course-card-header-home">
                    <div className="course-icon-large">📖</div>
                    {isEnrolled(course.id) && (
                      <span className="enrolled-badge-home">✓ Enrolled</span>
                    )}
                  </div>
                  <h4 className="course-title-home">{course.name}</h4>
                  <p className="course-description-home">
                    {course.description || "No description available"}
                  </p>
                  <div className="course-details">
                    <div className="detail-item">
                      <span className="detail-icon">🎓</span>
                      <span>{course.credits} Credits</span>
                    </div>
                    {course.instructor && (
                      <div className="detail-item">
                        <span className="detail-icon">👨‍🏫</span>
                        <span>{course.instructor}</span>
                      </div>
                    )}
                  </div>
                  {isEnrolled(course.id) && (
                    <div className="course-grade-home">
                      <strong>Grade:</strong>{" "}
                      <span className="grade-value-home">
                        {getEnrollmentGrade(course.id)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
