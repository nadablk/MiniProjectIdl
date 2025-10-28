<<<<<<< HEAD
// ===================================================================
// API GATEWAY CONFIGURATION
// ===================================================================
// All requests now go through the API Gateway on port 8080
// Gateway routes to the correct backend service automatically
//
// Gateway Device: Same as Spring Boot (Device 1)
// Gateway Port: 8080
//
// Routes:
// - /api/students/**     → Spring Boot (localhost:8081)
// - /api/universities/** → Spring Boot (localhost:8081)
// - /api/courses/**      → Django (192.168.117.225:9090)
// - /api/enrollments/**  → Django (192.168.117.225:9090)
// ===================================================================
=======
// Spring Boot Backend (Students & Universities) - Port 8081
const DJANGO_API_BASE_URL = "http://localhost:9090/api";
>>>>>>> 187be14004ad7e8047f6dbf22c7c8f4dfa9325f4

// OLD (Direct Backend Access):
// const SPRING_API_BASE_URL = "http://localhost:8081/api";
// const DJANGO_API_BASE_URL = "http://192.168.117.225:9090/api";

// NEW (Through Gateway):
const GATEWAY_BASE_URL = "http://192.168.117.225:8080/api";

// Use gateway for all API calls
const SPRING_API_BASE_URL = GATEWAY_BASE_URL;
const DJANGO_API_BASE_URL = GATEWAY_BASE_URL;
// Student API (Spring Boot)
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    const response = await fetch(`${SPRING_API_BASE_URL}/students`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await fetch(`${SPRING_API_BASE_URL}/students/${id}`);
    if (!response.ok) throw new Error("Failed to fetch student");
    return response.json();
  },

  // Create student
  createStudent: async (student) => {
    const response = await fetch(`${SPRING_API_BASE_URL}/students`, {
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
    const response = await fetch(`${SPRING_API_BASE_URL}/students/${id}`, {
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
    const response = await fetch(`${SPRING_API_BASE_URL}/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete student");
  },

  // Search students
  searchStudents: async (query) => {
    const response = await fetch(
      `${SPRING_API_BASE_URL}/students/search?query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) throw new Error("Failed to search students");
    return response.json();
  },

  // Get students by university
  getStudentsByUniversity: async (universityId) => {
    const response = await fetch(
      `${SPRING_API_BASE_URL}/students/university/${universityId}`
    );
    if (!response.ok) throw new Error("Failed to fetch students by university");
    return response.json();
  },

  // Get student statistics
  getStudentStats: async () => {
    const response = await fetch(`${SPRING_API_BASE_URL}/students/stats`);
    if (!response.ok) throw new Error("Failed to fetch student stats");
    return response.json();
  },
};

// University API (Spring Boot)
export const universityAPI = {
  // Get all universities
  getAllUniversities: async () => {
    const response = await fetch(`${SPRING_API_BASE_URL}/universities`);
    if (!response.ok) throw new Error("Failed to fetch universities");
    return response.json();
  },

  // Get university by ID
  getUniversityById: async (id) => {
    const response = await fetch(`${SPRING_API_BASE_URL}/universities/${id}`);
    if (!response.ok) throw new Error("Failed to fetch university");
    return response.json();
  },

  // Create university
  createUniversity: async (university) => {
    const response = await fetch(`${SPRING_API_BASE_URL}/universities`, {
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
    const response = await fetch(`${SPRING_API_BASE_URL}/universities/${id}`, {
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
    const response = await fetch(`${SPRING_API_BASE_URL}/universities/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete university");
  },

  // Search universities
  searchUniversities: async (name) => {
    const response = await fetch(
      `${SPRING_API_BASE_URL}/universities/search?name=${encodeURIComponent(
        name
      )}`
    );
    if (!response.ok) throw new Error("Failed to search universities");
    return response.json();
  },
};

// Course API (Django Backend)
export const courseAPI = {
  // Get all courses
  getAllCourses: async () => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/courses/`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/courses/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch course");
    return response.json();
  },

  // Create course
  createCourse: async (course) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/courses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error("Failed to create course");
    return response.json();
  },

  // Update course
  updateCourse: async (id, course) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/courses/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error("Failed to update course");
    return response.json();
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/courses/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete course");
  },
};

// Enrollment API (Django Backend)
export const enrollmentAPI = {
  // Get all enrollments
  getAllEnrollments: async () => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/enrollments/`);
    if (!response.ok) throw new Error("Failed to fetch enrollments");
    return response.json();
  },

  // Create enrollment
  createEnrollment: async (enrollment) => {
    console.log("Creating enrollment with data:", enrollment);
    const response = await fetch(`${DJANGO_API_BASE_URL}/enrollments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Server error response:", errorData);
      throw new Error(
        `Failed to create enrollment: ${JSON.stringify(errorData)}`
      );
    }
    return response.json();
  },

  // Update enrollment
  updateEnrollment: async (id, enrollment) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/enrollments/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) throw new Error("Failed to update enrollment");
    return response.json();
  },

  // Delete enrollment
  deleteEnrollment: async (id) => {
    const response = await fetch(`${DJANGO_API_BASE_URL}/enrollments/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete enrollment");
  },
};
