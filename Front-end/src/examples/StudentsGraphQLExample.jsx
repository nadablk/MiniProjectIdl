// ========================================
// EXAMPLE: Using GraphQL in Students Page
// ========================================

import { useState, useEffect } from "react";
// Import GraphQL instead of REST
import { studentGraphQL, universityGraphQL } from "../../services/graphqlApi";
import "../style/Students.css";

const StudentsWithGraphQL = () => {
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    universityId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✨ GraphQL: Fetch both students AND universities in ONE request
  const fetchData = async () => {
    try {
      setLoading(true);

      // Option 1: Fetch separately (like REST)
      const [studentsData, universitiesData] = await Promise.all([
        studentGraphQL.getAllStudents(),
        universityGraphQL.getAllUniversities(),
      ]);

      setStudents(studentsData);
      setUniversities(universitiesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ✨ GraphQL: Search with exact fields needed
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      // GraphQL search returns only what you need
      const data = await studentGraphQL.searchStudents(searchTerm);
      setStudents(data);
    } catch (err) {
      console.error("Error searching:", err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // ✨ GraphQL: Create student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        // Update
        await studentGraphQL.updateStudent(editingStudent.id, formData);
      } else {
        // Create
        await studentGraphQL.createStudent(formData);
      }

      setShowModal(false);
      setFormData({ firstName: "", lastName: "", email: "", universityId: "" });
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      console.error("Error saving student:", err);
      alert("Failed to save student");
    }
  };

  // ✨ GraphQL: Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const success = await studentGraphQL.deleteStudent(id);
      if (success) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      universityId: student.university?.id?.toString() || "",
    });
    setShowModal(true);
  };

  return (
    <div className="students-container">
      <h1>Students Management (GraphQL)</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setShowModal(true)}>Add Student</button>
      </div>

      {/* Students Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                <td>{student.university?.name || "N/A"}</td>
                <td>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <select
                value={formData.universityId}
                onChange={(e) =>
                  setFormData({ ...formData, universityId: e.target.value })
                }
                required
              >
                <option value="">Select University</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsWithGraphQL;

// ========================================
// COMPARISON: REST vs GraphQL
// ========================================

/*

REST API APPROACH (Current):
-----------------------------

import { studentAPI, universityAPI } from "../../services/api";

// Fetch students
const students = await studentAPI.getAllStudents();

// Fetch universities  
const universities = await universityAPI.getAllUniversities();

// Create student
await studentAPI.createStudent({
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  university: { id: 1 }
});

// Update student
await studentAPI.updateStudent(5, {
  firstName: "Jane",
  email: "jane@example.com"
});

// Delete student
await studentAPI.deleteStudent(5);

// Search students
await studentAPI.searchStudents("john");


GRAPHQL API APPROACH (New):
---------------------------

import { studentGraphQL, universityGraphQL } from "../../services/graphqlApi";

// Fetch students (with university data included automatically)
const students = await studentGraphQL.getAllStudents();

// Fetch universities
const universities = await universityGraphQL.getAllUniversities();

// Create student
await studentGraphQL.createStudent({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  universityId: "1"
});

// Update student (only send fields that changed)
await studentGraphQL.updateStudent(5, {
  firstName: "Jane",
  email: "jane@example.com"
});

// Delete student
await studentGraphQL.deleteStudent(5);

// Search students
await studentGraphQL.searchStudents("john");


KEY DIFFERENCES:
----------------

1. REST: Multiple requests for related data
   GraphQL: One request gets everything

2. REST: Gets all fields (over-fetching)
   GraphQL: Gets only requested fields

3. REST: Fixed response structure
   GraphQL: Flexible, query what you need

4. REST: Multiple endpoints (/students, /universities)
   GraphQL: Single endpoint (/graphql)


EXAMPLE - Get Student with University:
---------------------------------------

REST (2 requests):
------------------
const student = await studentAPI.getStudentById(5);
const university = await universityAPI.getUniversityById(student.university.id);

GraphQL (1 request):
--------------------
const student = await studentGraphQL.getStudentById(5);
// Already includes: student.university.name, student.university.location


WHICH TO USE?
-------------

Use REST (api.js) for:
- Django backend (Courses, Enrollments)
- Simple CRUD operations
- When you want all data

Use GraphQL (graphqlApi.js) for:
- Spring Boot backend (Students, Universities)  
- Complex nested data
- When you need specific fields only
- Better performance (fewer requests)

*/
