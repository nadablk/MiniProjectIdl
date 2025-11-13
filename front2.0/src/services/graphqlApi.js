// ===================================================================
// GraphQL API - Unified GraphQL Gateway
// ===================================================================
// All GraphQL queries go through a single GraphQL service (port 9000)
// This service aggregates APIs from:
// - Spring Boot (Students & Universities - port 8081)
// - Django (Courses & Enrollments - port 9090)
// - Chatbot (Translation & Summarization - port 8002)
//
// 🔧 TO CHANGE NETWORK IP: Edit /src/config/apiConfig.js
// ===================================================================

import { API_CONFIG } from "../config/apiConfig.js";

// Single GraphQL endpoint for all operations
const GRAPHQL_ENDPOINT = API_CONFIG.GRAPHQL_ENDPOINT;

/**
 * Generic GraphQL request function
 * @param {string} endpoint - GraphQL endpoint URL
 * @param {string} query - GraphQL query or mutation
 * @param {object} variables - Variables for the query (optional)
 * @returns {Promise} - Response data
 */
const graphqlRequest = async (endpoint, query, variables = {}) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
};

// ==================== STUDENT QUERIES ====================

export const studentGraphQL = {
  /**
   * Get all students
   * @returns {Promise<Array>} List of students
   */
  getAllStudents: async () => {
    const query = `
      query {
        allStudents {
          id
          firstName
          lastName
          email
          university {
            id
            name
            location
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return data.allStudents;
  },

  /**
   * Get student by ID
   * @param {string|number} id - Student ID
   * @returns {Promise<Object>} Student object
   */
  getStudentById: async (id) => {
    const query = `
      query GetStudent($id: ID!) {
        student(id: $id) {
          id
          firstName
          lastName
          email
          university {
            id
            name
            location
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      id: id.toString(),
    });
    return data.student;
  },

  /**
   * Search students by query
   * @param {string} searchQuery - Search term
   * @returns {Promise<Array>} Matching students
   */
  searchStudents: async (searchQuery) => {
    const query = `
      query SearchStudents($name: String!) {
        studentByName(name: $name) {
          id
          firstName
          lastName
          email
          university {
            id
            name
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      name: searchQuery,
    });
    return data.studentByName ? [data.studentByName] : [];
  },

  /**
   * Get students by university ID
   * @param {string|number} universityId - University ID
   * @returns {Promise<Array>} Students in that university
   */
  getStudentsByUniversity: async (universityId) => {
    const query = `
      query GetUniversity($id: ID!) {
        university(id: $id) {
          students {
            id
            firstName
            lastName
            email
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      id: universityId.toString(),
    });
    return data.university?.students || [];
  },

  /**
   * Get student statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStudentStats: async () => {
    const query = `
      query {
        allStudents {
          id
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return { totalStudents: data.allStudents?.length || 0 };
  },

  /**
   * Create a new student
   * @param {Object} student - Student data
   * @returns {Promise<Object>} Created student
   */
  createStudent: async (student) => {
    const mutation = `
      mutation CreateStudent($firstName: String!, $lastName: String!, $email: String!, $universityId: ID) {
        createStudent(firstName: $firstName, lastName: $lastName, email: $email, universityId: $universityId) {
          id
          firstName
          lastName
          email
          university {
            id
            name
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email,
      universityId:
        student.university?.id?.toString() ||
        student.universityId?.toString() ||
        null,
    });
    return data.createStudent;
  },

  /**
   * Update a student
   * @param {string|number} id - Student ID
   * @param {Object} student - Updated student data
   * @returns {Promise<Object>} Updated student
   */
  updateStudent: async (id, student) => {
    const mutation = `
      mutation UpdateStudent($id: ID!, $firstName: String, $lastName: String, $email: String, $universityId: ID) {
        updateStudent(id: $id, firstName: $firstName, lastName: $lastName, email: $email, universityId: $universityId) {
          id
          firstName
          lastName
          email
          university {
            id
            name
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      firstName: student.firstName || null,
      lastName: student.lastName || null,
      email: student.email || null,
      universityId:
        (student.university?.id || student.universityId)?.toString() || null,
    });
    return data.updateStudent;
  },

  /**
   * Delete a student
   * @param {string|number} id - Student ID
   * @returns {Promise<boolean>} Success status
   */
  deleteStudent: async (id) => {
    const mutation = `
      mutation DeleteStudent($id: ID!) {
        deleteStudent(id: $id)
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
    });
    return data.deleteStudent;
  },
};

// ==================== UNIVERSITY QUERIES ====================

export const universityGraphQL = {
  /**
   * Get all universities
   * @returns {Promise<Array>} List of universities
   */
  getAllUniversities: async () => {
    const query = `
      query {
        allUniversities {
          id
          name
          location
          students {
            id
            firstName
            lastName
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return data.allUniversities;
  },

  /**
   * Get university by ID
   * @param {string|number} id - University ID
   * @returns {Promise<Object>} University object
   */
  getUniversityById: async (id) => {
    const query = `
      query GetUniversity($id: ID!) {
        university(id: $id) {
          id
          name
          location
          students {
            id
            firstName
            lastName
            email
          }
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      id: id.toString(),
    });
    return data.university;
  },

  /**
   * Search universities by name
   * @param {string} name - Search term
   * @returns {Promise<Array>} Matching universities
   */
  searchUniversities: async (name) => {
    const query = `
      query SearchUniversities($name: String!) {
        universityByName(name: $name) {
          id
          name
          location
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, { name });
    return data.universityByName ? [data.universityByName] : [];
  },

  /**
   * Create a new university
   * @param {Object} university - University data
   * @returns {Promise<Object>} Created university
   */
  createUniversity: async (university) => {
    const mutation = `
      mutation CreateUniversity($name: String!, $location: String!) {
        createUniversity(name: $name, location: $location) {
          id
          name
          location
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      name: university.name,
      location: university.location || "",
    });
    return data.createUniversity;
  },

  /**
   * Update a university
   * @param {string|number} id - University ID
   * @param {Object} university - Updated university data
   * @returns {Promise<Object>} Updated university
   */
  updateUniversity: async (id, university) => {
    const mutation = `
      mutation UpdateUniversity($id: ID!, $name: String, $location: String) {
        updateUniversity(id: $id, name: $name, location: $location) {
          id
          name
          location
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      name: university.name || null,
      location: university.location || null,
    });
    return data.updateUniversity;
  },

  /**
   * Delete a university
   * @param {string|number} id - University ID
   * @returns {Promise<boolean>} Success status
   */
  deleteUniversity: async (id) => {
    const mutation = `
      mutation DeleteUniversity($id: ID!) {
        deleteUniversity(id: $id)
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
    });
    return data.deleteUniversity;
  },
};

// ==================== COMBINED QUERIES ====================

/**
 * Get all data needed for dashboard
 * @returns {Promise<Object>} Combined data
 */
export const getDashboardData = async () => {
  const query = `
    query {
      allStudents {
        id
        name
        university {
          name
        }
      }
      allUniversities {
        id
        name
        location
      }
    }
  `;
  const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
  return {
    students: data.allStudents,
    universities: data.allUniversities,
    studentStats: { totalStudents: data.allStudents?.length || 0 },
  };
};

/**
 * Get student with university details in one request
 * @param {string|number} id - Student ID
 * @returns {Promise<Object>} Student with university
 */
export const getStudentWithUniversity = async (id) => {
  const query = `
    query GetStudentWithUniversity($id: ID!) {
      student(id: $id) {
        id
        name
        email
        university {
          id
          name
          location
          students {
            id
            name
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
    id: id.toString(),
  });
  return data.student;
};

// ==================== COURSE QUERIES (Django GraphQL) ====================

export const courseGraphQL = {
  /**
   * Get all courses
   * @returns {Promise<Array>} List of courses
   */
  getAllCourses: async () => {
    const query = `
      query {
        allCourses {
          id
          name
          description
          credits
          instructor
          created_at
          updated_at
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return data.allCourses;
  },

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Object>} Course object
   */
  getCourseById: async (id) => {
    const query = `
      query GetCourse($id: ID!) {
        course(id: $id) {
          id
          name
          description
          credits
          instructor
          created_at
          updated_at
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      id: id.toString(),
    });
    return data.course;
  },

  /**
   * Get course by name
   * @param {string} name - Course name
   * @returns {Promise<Object>} Course object
   */
  getCourseByName: async (name) => {
    const query = `
      query GetCourseByName($name: String!) {
        courseByName(name: $name) {
          id
          name
          description
          credits
          instructor
          created_at
          updated_at
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, { name });
    return data.courseByName;
  },

  /**
   * Create a new course
   * @param {Object} course - Course data {name, description, credits, instructor}
   * @returns {Promise<Object>} Created course
   */
  createCourse: async (course) => {
    const mutation = `
      mutation CreateCourse($name: String!, $description: String, $credits: Int, $instructor: String) {
        createCourse(name: $name, description: $description, credits: $credits, instructor: $instructor) {
          id
          name
          description
          credits
          instructor
          created_at
          updated_at
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      name: course.name,
      description: course.description || "",
      credits: course.credits ? parseInt(course.credits) : null,
      instructor: course.instructor || null,
    });
    return data.createCourse;
  },

  /**
   * Update a course
   * @param {number} id - Course ID
   * @param {Object} course - Updated course data
   * @returns {Promise<Object>} Updated course
   */
  updateCourse: async (id, course) => {
    const mutation = `
      mutation UpdateCourse($id: ID!, $name: String, $description: String, $credits: Int, $instructor: String) {
        updateCourse(id: $id, name: $name, description: $description, credits: $credits, instructor: $instructor) {
          id
          name
          description
          credits
          instructor
          created_at
          updated_at
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      name: course.name || null,
      description: course.description || null,
      credits: course.credits ? parseInt(course.credits) : null,
      instructor: course.instructor || null,
    });
    return data.updateCourse;
  },

  /**
   * Delete a course
   * @param {number} id - Course ID
   * @returns {Promise<Object>} Delete result
   */
  deleteCourse: async (id) => {
    const mutation = `
      mutation DeleteCourse($id: ID!) {
        deleteCourse(id: $id)
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
    });
    return data.deleteCourse;
  },
};

// ==================== ENROLLMENT QUERIES (Django GraphQL) ====================

export const enrollmentGraphQL = {
  /**
   * Get all enrollments
   * @returns {Promise<Array>} List of enrollments
   */
  getAllEnrollments: async () => {
    const query = `
      query {
        allEnrollments {
          id
          student_id
          student_name
          course
          course_name
          grade
          enrollment_date
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return data.allEnrollments;
  },

  /**
   * Get enrollments by course ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} List of enrollments for that course
   */
  getEnrollmentsByCourse: async (courseId) => {
    const query = `
      query GetEnrollmentsByCourse($courseId: Int!) {
        enrollmentsByCourse(courseId: $courseId) {
          id
          student_id
          student_name
          course
          course_name
          grade
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      courseId: parseInt(courseId),
    });
    return data.enrollmentsByCourse;
  },

  /**
   * Get enrollments by student ID
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} List of enrollments for that student
   */
  getEnrollmentsByStudent: async (studentId) => {
    const query = `
      query GetEnrollmentsByStudent($studentId: Int!) {
        enrollmentsByStudent(studentId: $studentId) {
          id
          student_id
          student_name
          course
          course_name
          grade
          enrollment_date
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query, {
      studentId: parseInt(studentId),
    });
    return data.enrollmentsByStudent;
  },

  /**
   * Add a student to a course (create enrollment)
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @param {string} grade - Optional grade
   * @returns {Promise<Object>} Enrollment result
   */
  addStudentToCourse: async (studentId, courseId, grade = null) => {
    const mutation = `
      mutation AddStudentToCourse($studentId: Int!, $courseId: Int!, $grade: String) {
        addStudentToCourse(studentId: $studentId, courseId: $courseId, grade: $grade) {
          id
          student_id
          student_name
          course
          course_name
          grade
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
      grade: grade,
    });
    return data.addStudentToCourse;
  },

  /**
   * Update an enrollment
   * @param {number} id - Enrollment ID
   * @param {Object} enrollment - Updated enrollment data {studentId, courseId, grade}
   * @returns {Promise<Object>} Updated enrollment
   */
  updateEnrollment: async (id, enrollment) => {
    const mutation = `
      mutation UpdateEnrollment($id: ID!, $studentId: Int, $courseId: Int, $grade: String) {
        updateEnrollment(id: $id, studentId: $studentId, courseId: $courseId, grade: $grade) {
          id
          student_id
          student_name
          course
          course_name
          grade
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      studentId: enrollment.studentId ? parseInt(enrollment.studentId) : null,
      courseId: enrollment.courseId ? parseInt(enrollment.courseId) : null,
      grade: enrollment.grade || null,
    });
    return data.updateEnrollment;
  },

  /**
   * Remove a student from a course (delete enrollment)
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Delete result
   */
  removeStudentFromCourse: async (studentId, courseId) => {
    const mutation = `
      mutation RemoveStudentFromCourse($studentId: Int!, $courseId: Int!) {
        removeStudentFromCourse(studentId: $studentId, courseId: $courseId)
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
    });
    return data.removeStudentFromCourse;
  },
};

// ==================== CHATBOT QUERIES (Chatbot Service) ====================

export const chatbotGraphQL = {
  /**
   * Translate text from one language to another
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code
   * @param {string} targetLang - Target language code
   * @returns {Promise<Object>} Translation result
   */
  translate: async (text, sourceLang, targetLang) => {
    const mutation = `
      mutation Translate($text: String!, $sourceLang: String!, $targetLang: String!) {
        translate(text: $text, sourceLang: $sourceLang, targetLang: $targetLang) {
          success
          originalText
          translatedText
          sourceLang
          targetLang
          error
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      text,
      sourceLang,
      targetLang,
    });
    return data.translate;
  },

  /**
   * Summarize text
   * @param {string} text - Text to summarize
   * @param {number} maxLength - Maximum length of summary (optional)
   * @param {number} minLength - Minimum length of summary (optional)
   * @returns {Promise<Object>} Summarization result
   */
  summarize: async (text, maxLength = null, minLength = null) => {
    const mutation = `
      mutation Summarize($text: String!, $maxLength: Int, $minLength: Int) {
        summarize(text: $text, maxLength: $maxLength, minLength: $minLength) {
          success
          originalText
          summary
          originalLength
          summaryLength
          error
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, mutation, {
      text,
      maxLength,
      minLength,
    });
    return data.summarize;
  },

  /**
   * Check chatbot service health
   * @returns {Promise<Object>} Health status
   */
  healthCheck: async () => {
    const query = `
      query {
        chatbotHealth {
          success
          status
          service
          version
        }
      }
    `;
    const data = await graphqlRequest(GRAPHQL_ENDPOINT, query);
    return data.chatbotHealth;
  },
};
