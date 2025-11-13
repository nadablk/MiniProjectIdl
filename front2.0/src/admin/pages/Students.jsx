import { useState, useEffect } from "react";
import { studentGraphQL, universityGraphQL } from "../../services/graphqlApi";
import "../style/Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding/editing students
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: { id: "" },
  });

  useEffect(() => {
    fetchStudents();
    fetchUniversities();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentGraphQL.getAllStudents();
      setStudents(data || []); // Ensure we always have an array
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
      setStudents([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const data = await universityGraphQL.getAllUniversities();
      setUniversities(data);
    } catch (err) {
      console.error("Error fetching universities:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }

    try {
      setLoading(true);
      const data = await studentGraphQL.searchStudents(searchTerm);
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Error searching students:", err);
      setError("Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "university") {
      setFormData({ ...formData, university: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update existing student
        await studentGraphQL.updateStudent(editingStudent.id, formData);
      } else {
        // Create new student
        await studentGraphQL.createStudent(formData);
      }
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        university: { id: "" },
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      alert("Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      university: { id: student.university?.id || "" },
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      university: { id: "" },
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      university: { id: "" },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentGraphQL.deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  // Trigger search when search term changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchStudents();
      } else {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const filteredStudents = students;

  return (
    <div className="students-container">
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p className="page-subtitle">
            {(students || []).length} student
            {(students || []).length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <button className="add-btn" onClick={handleAddNew}>
          <span className="btn-icon">➕</span>
          Add Student
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn active" onClick={fetchStudents}>
            All
          </button>
          <button className="filter-btn">Active</button>
          <button className="filter-btn">Graduated</button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>University</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filteredStudents || []).map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td>
                    <div className="student-name">
                      <span className="avatar">👤</span>
                      {student.firstName} {student.lastName}
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    <span className="department-badge">
                      {student.university?.name || "N/A"}
                    </span>
                  </td>
                  <td>{student.university?.location || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => handleEdit(student)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(student.id)}
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

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Student's first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Student's last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@philosophe.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>University</label>
                <select
                  name="university"
                  value={formData.university.id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} - {uni.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingStudent ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
