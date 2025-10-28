import { useState, useEffect } from "react";
import { courseGraphQL, enrollmentGraphQL } from "../services/graphqlApi";
import "../style/CoursesStudent.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterView, setFilterView] = useState("all"); // 'all', 'enrolled'

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseGraphQL.getAllCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentGraphQL.getAllEnrollments();
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

  return (
    <div className="courses-page">
      {/* Header */}
      <header className="courses-header">
        <div className="header-content">
          <h1>📚 Available Courses</h1>
          <p>Explore and view your enrolled courses</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="courses-content">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="courses-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterView === "all" ? "active" : ""}`}
              onClick={() => setFilterView("all")}
            >
              All Courses
            </button>
            <button
              className={`filter-btn ${
                filterView === "enrolled" ? "active" : ""
              }`}
              onClick={() => setFilterView("enrolled")}
            >
              My Enrollments
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.length === 0 ? (
              <div className="no-courses">
                <p>No courses found</p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card ${
                    isEnrolled(course.id) ? "enrolled" : ""
                  }`}
                >
                  <div className="course-card-header">
                    <div className="course-icon">📖</div>
                    {isEnrolled(course.id) && (
                      <span className="enrolled-badge">✓ Enrolled</span>
                    )}
                  </div>
                  <h3 className="course-title">{course.name}</h3>
                  <p className="course-description">
                    {course.description || "No description available"}
                  </p>
                  <div className="course-meta">
                    <div className="meta-item">
                      <span className="meta-icon">🎓</span>
                      <span>{course.credits} Credits</span>
                    </div>
                    {course.instructor && (
                      <div className="meta-item">
                        <span className="meta-icon">👨‍🏫</span>
                        <span>{course.instructor}</span>
                      </div>
                    )}
                  </div>
                  {isEnrolled(course.id) && (
                    <div className="course-grade">
                      <strong>Grade:</strong> {getEnrollmentGrade(course.id)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
