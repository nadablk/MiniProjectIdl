import { useState, useEffect } from "react";
import { courseAPI, enrollmentAPI, studentAPI } from "../../services/api";
import "../style/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("courses"); // 'courses' or 'enrollments'

  // Form state for courses
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    description: "",
    credits: "",
    instructor: "",
  });

  // Form state for enrollments
  const [enrollmentFormData, setEnrollmentFormData] = useState({
    student: "",
    course: "",
    grade: "",
    enrollment_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAllCourses();
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
      const data = await enrollmentAPI.getAllEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Course handlers
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData({ ...courseFormData, [name]: value });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse.id, courseFormData);
      } else {
        await courseAPI.createCourse(courseFormData);
      }
      setShowCourseModal(false);
      setCourseFormData({
        name: "",
        description: "",
        credits: "",
        instructor: "",
      });
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      name: course.name || "",
      description: course.description || "",
      credits: course.credits || "",
      instructor: course.instructor || "",
    });
    setShowCourseModal(true);
  };

  const handleAddNewCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      name: "",
      description: "",
      credits: "",
      instructor: "",
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await courseAPI.deleteCourse(id);
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  // Enrollment handlers
  const handleEnrollmentInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentFormData({ ...enrollmentFormData, [name]: value });
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract IDs from objects if they exist
      const enrollmentData = {
        student_id:
          typeof enrollmentFormData.student === "object"
            ? enrollmentFormData.student.id
            : parseInt(enrollmentFormData.student),
        course:
          typeof enrollmentFormData.course === "object"
            ? enrollmentFormData.course.id
            : parseInt(enrollmentFormData.course),
        grade: enrollmentFormData.grade || "",
        enrollment_date: enrollmentFormData.enrollment_date,
      };

      console.log("Submitting enrollment data:", enrollmentData);

      if (editingEnrollment) {
        // Update existing enrollment
        await enrollmentAPI.updateEnrollment(
          editingEnrollment.id,
          enrollmentData
        );
      } else {
        // Create new enrollment
        await enrollmentAPI.createEnrollment(enrollmentData);
      }
      setShowEnrollmentModal(false);
      setEnrollmentFormData({
        student: "",
        course: "",
        grade: "",
        enrollment_date: new Date().toISOString().split("T")[0],
      });
      setEditingEnrollment(null);
      fetchEnrollments();
    } catch (err) {
      console.error("Error saving enrollment:", err);
      alert(`Failed to save enrollment: ${err.message}`);
    }
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEnrollmentFormData({
      student: enrollment.student || "",
      course: enrollment.course || "",
      grade: enrollment.grade || "",
      enrollment_date:
        enrollment.enrollment_date || new Date().toISOString().split("T")[0],
    });
    setShowEnrollmentModal(true);
  };

  const handleAddNewEnrollment = () => {
    setEditingEnrollment(null);
    setEnrollmentFormData({
      student: "",
      course: "",
      grade: "",
      enrollment_date: new Date().toISOString().split("T")[0],
    });
    setShowEnrollmentModal(true);
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    try {
      await enrollmentAPI.deleteEnrollment(id);
      fetchEnrollments();
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      alert("Failed to delete enrollment");
    }
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseFormData({
      name: "",
      description: "",
      credits: "",
      instructor: "",
    });
  };

  const handleCloseEnrollmentModal = () => {
    setShowEnrollmentModal(false);
    setEditingEnrollment(null);
    setEnrollmentFormData({
      student: "",
      course: "",
      grade: "",
      enrollment_date: new Date().toISOString().split("T")[0],
    });
  };

  const getStudentName = (enrollment) => {
    // First try to find student in the students array from Spring Boot
    const student = students.find((s) => s.id === enrollment.student_id);
    if (student) {
      return `${student.firstName} ${student.lastName}`;
    }
    // Fallback to backend's student_name if student not found
    if (enrollment.student_name) {
      return enrollment.student_name;
    }
    return "Unknown";
  };

  const getCourseName = (enrollment) => {
    // Use course_name from backend if available, otherwise fallback to finding in courses array
    if (enrollment.course_name) {
      return enrollment.course_name;
    }
    const course = courses.find((c) => c.id === enrollment.course);
    return course ? course.name : "Unknown";
  };

  const filteredCourses = courses.filter((course) =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = getStudentName(enrollment);
    const courseName = getCourseName(enrollment);
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="courses-container">
      <div className="page-header">
        <div>
          <h1>Course Management</h1>
          <p className="page-subtitle">
            {activeTab === "courses"
              ? `${courses.length} course${
                  courses.length !== 1 ? "s" : ""
                } available`
              : `${enrollments.length} enrollment${
                  enrollments.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>
        <button
          className="add-btn"
          onClick={
            activeTab === "courses"
              ? handleAddNewCourse
              : handleAddNewEnrollment
          }
        >
          <span className="btn-icon">➕</span>
          {activeTab === "courses" ? "Add Course" : "Add Enrollment"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          📚 Courses
        </button>
        <button
          className={`tab ${activeTab === "enrollments" ? "active" : ""}`}
          onClick={() => setActiveTab("enrollments")}
        >
          📝 Enrollments
        </button>
      </div>

      {/* Search Bar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={
              activeTab === "courses"
                ? "Search courses..."
                : "Search enrollments..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "courses" ? (
        <div className="table-container">
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : (
            <table className="courses-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>#{course.id}</td>
                    <td>
                      <div className="course-name">
                        <span className="course-icon">📖</span>
                        {course.name}
                      </div>
                    </td>
                    <td className="description-cell">
                      {course.description || "No description"}
                    </td>
                    <td>
                      <span className="credits-badge">{course.credits}</span>
                    </td>
                    <td>{course.instructor || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          title="Edit"
                          onClick={() => handleEditCourse(course)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="table-container">
          {loading ? (
            <div className="loading">Loading enrollments...</div>
          ) : (
            <table className="courses-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Enrollment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>#{enrollment.id}</td>
                    <td>
                      <div className="student-name">
                        <span className="avatar">👤</span>
                        {getStudentName(enrollment)}
                      </div>
                    </td>
                    <td>{getCourseName(enrollment)}</td>
                    <td>
                      <span className="grade-badge">
                        {enrollment.grade || "Not graded"}
                      </span>
                    </td>
                    <td>
                      {enrollment.enrollment_date
                        ? new Date(
                            enrollment.enrollment_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          title="Edit"
                          onClick={() => handleEditEnrollment(enrollment)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={handleCloseCourseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
              <button className="close-btn" onClick={handleCloseCourseModal}>
                ✕
              </button>
            </div>
            <form className="course-form" onSubmit={handleCourseSubmit}>
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Introduction to Philosophy"
                  value={courseFormData.name}
                  onChange={handleCourseInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Course description..."
                  value={courseFormData.description}
                  onChange={handleCourseInputChange}
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="number"
                    name="credits"
                    placeholder="3"
                    value={courseFormData.credits}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    placeholder="Professor name"
                    value={courseFormData.instructor}
                    onChange={handleCourseInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseCourseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCourse ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="modal-overlay" onClick={handleCloseEnrollmentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingEnrollment ? "Edit Enrollment" : "Add Enrollment"}
              </h2>
              <button
                className="close-btn"
                onClick={handleCloseEnrollmentModal}
              >
                ✕
              </button>
            </div>
            <form className="course-form" onSubmit={handleEnrollmentSubmit}>
              <div className="form-group">
                <label>Student</label>
                <select
                  name="student"
                  value={enrollmentFormData.student}
                  onChange={handleEnrollmentInputChange}
                  required
                  disabled={editingEnrollment} // Disable when editing
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course</label>
                <select
                  name="course"
                  value={enrollmentFormData.course}
                  onChange={handleEnrollmentInputChange}
                  required
                  disabled={editingEnrollment} // Disable when editing
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.credits} credits)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grade</label>
                  <input
                    type="text"
                    name="grade"
                    placeholder="A, B, C, etc."
                    value={enrollmentFormData.grade}
                    onChange={handleEnrollmentInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Enrollment Date</label>
                  <input
                    type="date"
                    name="enrollment_date"
                    value={enrollmentFormData.enrollment_date}
                    onChange={handleEnrollmentInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseEnrollmentModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingEnrollment ? "Update Enrollment" : "Add Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
