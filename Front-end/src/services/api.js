// API Base URL
const API_BASE_URL = "http://localhost:8081/api";

// Student API
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!response.ok) throw new Error("Failed to fetch student");
    return response.json();
  },

  // Create student
  createStudent: async (student) => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error("Failed to create student");
    return response.json();
  },

  // Update student
  updateStudent: async (id, student) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error("Failed to update student");
    return response.json();
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete student");
  },

  // Search students
  searchStudents: async (query) => {
    const response = await fetch(
      `${API_BASE_URL}/students/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to search students");
    return response.json();
  },

  // Get students by university
  getStudentsByUniversity: async (universityId) => {
    const response = await fetch(
      `${API_BASE_URL}/students/university/${universityId}`
    );
    if (!response.ok) throw new Error("Failed to fetch students by university");
    return response.json();
  },

  // Get student statistics
  getStudentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/students/stats`);
    if (!response.ok) throw new Error("Failed to fetch student stats");
    return response.json();
  },
};

// University API
export const universityAPI = {
  // Get all universities
  getAllUniversities: async () => {
    const response = await fetch(`${API_BASE_URL}/universities`);
    if (!response.ok) throw new Error("Failed to fetch universities");
    return response.json();
  },

  // Get university by ID
  getUniversityById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/universities/${id}`);
    if (!response.ok) throw new Error("Failed to fetch university");
    return response.json();
  },

  // Create university
  createUniversity: async (university) => {
    const response = await fetch(`${API_BASE_URL}/universities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(university),
    });
    if (!response.ok) throw new Error("Failed to create university");
    return response.json();
  },

  // Update university
  updateUniversity: async (id, university) => {
    const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(university),
    });
    if (!response.ok) throw new Error("Failed to update university");
    return response.json();
  },

  // Delete university
  deleteUniversity: async (id) => {
    const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete university");
  },

  // Search universities
  searchUniversities: async (name) => {
    const response = await fetch(
      `${API_BASE_URL}/universities/search?name=${encodeURIComponent(name)}`
    );
    if (!response.ok) throw new Error("Failed to search universities");
    return response.json();
  },
};
