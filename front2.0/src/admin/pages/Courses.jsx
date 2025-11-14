import { useState, useEffect } from "react";
import {
  courseGraphQL,
  enrollmentGraphQL,
  studentGraphQL,
} from "../../services/graphqlApi";
import "../style/Courses.css";

const Courses = () => {
  // State management
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Course modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    description: "",
    credits: "",
    instructor: "",
  });

  // Enrollment modal state
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [enrollmentFormData, setEnrollmentFormData] = useState({
    studentId: "",
    courseId: "",
    grade: "",
  });

  // Fetch data on mount - optimized with parallel loading
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel for faster loading
      const [coursesData, enrollmentsData, studentsData] = await Promise.all([
        courseGraphQL.getAllCourses().catch(() => []),
        enrollmentGraphQL.getAllEnrollments().catch(() => []),
        studentGraphQL.getAllStudents().catch(() => []),
      ]);

      setCourses(coursesData);
      setEnrollments(enrollmentsData);
      setStudents(studentsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseGraphQL.getAllCourses();
      setCourses(data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentGraphQL.getAllEnrollments();
      setEnrollments(data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  // ==================== COURSE HANDLERS ====================

  const handleCourseFormChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData({ ...courseFormData, [name]: value });
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      name: "",
      description: "",
      credits: "",
      instructor: "",
    });
    setShowCourseModal(true);
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

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const updated = await courseGraphQL.updateCourse(
          editingCourse.id,
          courseFormData
        );
        // Optimistic update - update local state immediately
        setCourses(
          courses.map((c) => (c.id === editingCourse.id ? updated : c))
        );
      } else {
        const created = await courseGraphQL.createCourse(courseFormData);
        // Optimistic update - add to local state immediately
        setCourses([...courses, created]);
      }
      setShowCourseModal(false);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course: " + err.message);
      // Fallback: refresh from server on error
      await fetchCourses();
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    try {
      await courseGraphQL.deleteCourse(id);
      // Optimistic update - remove from local state immediately
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course: " + err.message);
      // Fallback: refresh from server on error
      await fetchCourses();
    }
  };

  // ==================== ENROLLMENT HANDLERS ====================

  const handleEnrollmentFormChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentFormData({ ...enrollmentFormData, [name]: value });
  };

  const handleAddEnrollment = () => {
    setEditingEnrollment(null);
    setEnrollmentFormData({
      studentId: "",
      courseId: "",
      grade: "",
    });
    setShowEnrollmentModal(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEnrollmentFormData({
      studentId: enrollment.student_id || "",
      courseId: enrollment.course || "",
      grade: enrollment.grade || "",
    });
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentId = parseInt(enrollmentFormData.studentId);
      const courseId = parseInt(enrollmentFormData.courseId);
      const grade = enrollmentFormData.grade || null;

      if (!studentId || !courseId) {
        alert("Please select both student and course");
        return;
      }

      if (editingEnrollment) {
        // Update enrollment
        const updated = await enrollmentGraphQL.updateEnrollment(
          editingEnrollment.id,
          {
            studentId,
            courseId,
            grade,
          }
        );
        // Optimistic update
        setEnrollments(
          enrollments.map((e) => (e.id === editingEnrollment.id ? updated : e))
        );
      } else {
        // Create new enrollment
        const created = await enrollmentGraphQL.addStudentToCourse(
          studentId,
          courseId,
          grade
        );
        // Optimistic update
        setEnrollments([...enrollments, created]);
      }

      setShowEnrollmentModal(false);
    } catch (err) {
      console.error("Error saving enrollment:", err);
      alert("Failed to save enrollment: " + err.message);
      // Fallback: refresh from server on error
      await fetchEnrollments();
    }
  };

  const handleDeleteEnrollment = async (enrollment) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }
    try {
      const result = await enrollmentGraphQL.removeStudentFromCourse(
        enrollment.student_id,
        enrollment.course
      );
      if (result === false) {
        throw new Error("Failed to delete enrollment");
      }
      // Optimistic update - remove from local state immediately
      setEnrollments(enrollments.filter((e) => e.id !== enrollment.id));
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      alert("Failed to delete enrollment: " + err.message);
      // Fallback: refresh from server on error
      await fetchEnrollments();
    }
  };

  // ==================== FILTERING (Memoized for performance) ====================

  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      course.name?.toLowerCase().includes(search) ||
      course.instructor?.toLowerCase().includes(search) ||
      course.description?.toLowerCase().includes(search)
    );
  });

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      enrollment.student_name?.toLowerCase().includes(search) ||
      enrollment.course_name?.toLowerCase().includes(search) ||
      enrollment.grade?.toLowerCase().includes(search)
    );
  });

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">⏳ Loading...</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>📚 Courses & Enrollments</h1>
          <p className="page-subtitle">
            Manage courses and student enrollments
          </p>
        </div>
        <button
          className="add-btn"
          onClick={
            activeTab === "courses" ? handleAddCourse : handleAddEnrollment
          }
        >
          <span className="btn-icon">+</span>
          Add {activeTab === "courses" ? "Course" : "Enrollment"}
        </button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          Courses ({courses.length})
        </button>
        <button
          className={`tab ${activeTab === "enrollments" ? "active" : ""}`}
          onClick={() => setActiveTab("enrollments")}
        >
          Enrollments ({enrollments.length})
        </button>
      </div>

      {/* Search */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "courses" ? (
        <CoursesTable
          courses={filteredCourses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      ) : (
        <EnrollmentsTable
          enrollments={filteredEnrollments}
          onEdit={handleEditEnrollment}
          onDelete={handleDeleteEnrollment}
        />
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <CourseModal
          course={editingCourse}
          formData={courseFormData}
          onChange={handleCourseFormChange}
          onSubmit={handleCourseSubmit}
          onClose={() => setShowCourseModal(false)}
        />
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <EnrollmentModal
          enrollment={editingEnrollment}
          formData={enrollmentFormData}
          students={students}
          courses={courses}
          onChange={handleEnrollmentFormChange}
          onSubmit={handleEnrollmentSubmit}
          onClose={() => setShowEnrollmentModal(false)}
        />
      )}
    </div>
  );
};

// ==================== COURSES TABLE ====================

const CoursesTable = ({ courses, onEdit, onDelete }) => {
  if (courses.length === 0) {
    return (
      <div className="table-container">
        <div className="loading">No courses found</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="courses-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Description</th>
            <th>Credits</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <div className="course-name">
                  <span className="course-icon">📖</span>
                  {course.name}
                </div>
              </td>
              <td>
                <div className="description-cell">{course.description}</div>
              </td>
              <td>
                <span className="credits-badge">{course.credits} Credits</span>
              </td>
              <td>{course.instructor}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(course)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(course.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== ENROLLMENTS TABLE ====================

const EnrollmentsTable = ({ enrollments, onEdit, onDelete }) => {
  if (enrollments.length === 0) {
    return (
      <div className="table-container">
        <div className="loading">No enrollments found</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="courses-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Grade</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>
                <div className="student-name">
                  <span className="avatar">👤</span>
                  {enrollment.student_name ||
                    `Student #${enrollment.student_id}`}
                </div>
              </td>
              <td>
                <div className="course-name">
                  <span className="course-icon">📖</span>
                  {enrollment.course_name || `Course #${enrollment.course}`}
                </div>
              </td>
              <td>
                {enrollment.grade ? (
                  <span className="grade-badge">{enrollment.grade}</span>
                ) : (
                  <span style={{ color: "#999" }}>Not graded</span>
                )}
              </td>
              <td>
                {enrollment.enrollment_date
                  ? new Date(enrollment.enrollment_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(enrollment)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(enrollment)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== COURSE MODAL ====================

const CourseModal = ({ course, formData, onChange, onSubmit, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{course ? "Edit Course" : "Add New Course"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="course-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g., Introduction to Philosophy"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Brief course description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="credits">Credits *</label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={onChange}
                placeholder="e.g., 3"
                min="1"
                max="12"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructor">Instructor *</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={onChange}
                placeholder="e.g., Dr. Smith"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {course ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== ENROLLMENT MODAL ====================

const EnrollmentModal = ({
  enrollment,
  formData,
  students,
  courses,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{enrollment ? "Edit Enrollment" : "Add New Enrollment"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="course-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student *</label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={onChange}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="courseId">Course *</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={onChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.credits} credits)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade (Optional)</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={onChange}
              placeholder="e.g., A, B+, 85"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {enrollment ? "Update Enrollment" : "Create Enrollment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Courses;
