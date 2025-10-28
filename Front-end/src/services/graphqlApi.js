// ===================================================================
// GraphQL API - Now using API Gateway
// ===================================================================
// GraphQL endpoints now route through the API Gateway
// Gateway forwards /graphql/spring/** to Spring Boot (port 8081)
// Gateway forwards /graphql/django/** to Django (port 9090)
//
// 🔧 TO CHANGE NETWORK IP: Edit /src/config/apiConfig.js
// ===================================================================

import { API_CONFIG } from "../config/apiConfig.js";

// Spring Boot GraphQL endpoint (Students & Universities)
const SPRING_GRAPHQL_ENDPOINT = API_CONFIG.SPRING_GRAPHQL;

// Django GraphQL endpoint (Courses & Enrollments)
const DJANGO_GRAPHQL_ENDPOINT = API_CONFIG.DJANGO_GRAPHQL;

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
        students {
          id
          firstName
          lastName
          email
          fullName
          university {
            id
            name
            location
          }
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query);
    return data.students;
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
          fullName
          university {
            id
            name
            location
          }
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, {
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
      query SearchStudents($query: String!) {
        searchStudents(query: $query) {
          id
          firstName
          lastName
          email
          fullName
          university {
            id
            name
          }
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, {
      query: searchQuery,
    });
    return data.searchStudents;
  },

  /**
   * Get students by university ID
   * @param {string|number} universityId - University ID
   * @returns {Promise<Array>} Students in that university
   */
  getStudentsByUniversity: async (universityId) => {
    const query = `
      query GetStudentsByUniversity($universityId: ID!) {
        studentsByUniversity(universityId: $universityId) {
          id
          firstName
          lastName
          email
          fullName
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, {
      universityId: universityId.toString(),
    });
    return data.studentsByUniversity;
  },

  /**
   * Get student statistics
   * @returns {Promise<Object>} Statistics object
   */
  getStudentStats: async () => {
    const query = `
      query {
        studentStats {
          totalStudents
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query);
    return data.studentStats;
  },

  /**
   * Create a new student
   * @param {Object} student - Student data
   * @returns {Promise<Object>} Created student
   */
  createStudent: async (student) => {
    const mutation = `
      mutation CreateStudent($input: StudentInput!) {
        createStudent(input: $input) {
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
    const input = {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      universityId:
        student.university?.id?.toString() || student.universityId?.toString(),
    };
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
      input,
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
      mutation UpdateStudent($id: ID!, $input: StudentUpdateInput!) {
        updateStudent(id: $id, input: $input) {
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
    const input = {};
    if (student.firstName) input.firstName = student.firstName;
    if (student.lastName) input.lastName = student.lastName;
    if (student.email) input.email = student.email;
    if (student.university?.id || student.universityId) {
      input.universityId = (
        student.university?.id || student.universityId
      ).toString();
    }

    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      input,
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
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
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
        universities {
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
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query);
    return data.universities;
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
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, {
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
        searchUniversities(name: $name) {
          id
          name
          location
        }
      }
    `;
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, { name });
    return data.searchUniversities;
  },

  /**
   * Create a new university
   * @param {Object} university - University data
   * @returns {Promise<Object>} Created university
   */
  createUniversity: async (university) => {
    const mutation = `
      mutation CreateUniversity($input: UniversityInput!) {
        createUniversity(input: $input) {
          id
          name
          location
        }
      }
    `;
    const input = {
      name: university.name,
      location: university.location,
    };
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
      input,
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
      mutation UpdateUniversity($id: ID!, $input: UniversityUpdateInput!) {
        updateUniversity(id: $id, input: $input) {
          id
          name
          location
        }
      }
    `;
    const input = {};
    if (university.name) input.name = university.name;
    if (university.location) input.location = university.location;

    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
      id: id.toString(),
      input,
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
    const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, mutation, {
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
      students {
        id
        firstName
        lastName
        university {
          name
        }
      }
      universities {
        id
        name
        location
      }
      studentStats {
        totalStudents
      }
    }
  `;
  const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query);
  return data;
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
        firstName
        lastName
        email
        fullName
        university {
          id
          name
          location
          students {
            id
            fullName
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(SPRING_GRAPHQL_ENDPOINT, query, {
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
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query);
    return data.allCourses;
  },

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Object>} Course object
   */
  getCourseById: async (id) => {
    const query = `
      query GetCourse($id: Int!) {
        course(id: $id) {
          id
          name
          description
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query, {
      id: parseInt(id),
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
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query, { name });
    return data.courseByName;
  },

  /**
   * Create a new course
   * @param {Object} course - Course data {name, description}
   * @returns {Promise<Object>} Created course
   */
  createCourse: async (course) => {
    const mutation = `
      mutation CreateCourse($name: String!, $description: String) {
        createCourse(name: $name, description: $description) {
          success
          message
          course {
            id
            name
            description
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, mutation, {
      name: course.name,
      description: course.description || null,
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
      mutation UpdateCourse($id: Int!, $name: String, $description: String) {
        updateCourse(id: $id, name: $name, description: $description) {
          success
          message
          course {
            id
            name
            description
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, mutation, {
      id: parseInt(id),
      name: course.name || null,
      description: course.description || null,
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
      mutation DeleteCourse($id: Int!) {
        deleteCourse(id: $id) {
          success
          message
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, mutation, {
      id: parseInt(id),
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
          studentId
          course {
            id
            name
            description
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query);
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
          studentId
          course {
            id
            name
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query, {
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
          studentId
          course {
            id
            name
            description
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, query, {
      studentId: parseInt(studentId),
    });
    return data.enrollmentsByStudent;
  },

  /**
   * Add a student to a course (create enrollment)
   * @param {number} studentId - Student ID
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Enrollment result
   */
  addStudentToCourse: async (studentId, courseId) => {
    const mutation = `
      mutation AddStudentToCourse($studentId: Int!, $courseId: Int!) {
        addStudentToCourse(studentId: $studentId, courseId: $courseId) {
          success
          message
          enrollment {
            id
            studentId
            course {
              id
              name
            }
          }
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, mutation, {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
    });
    return data.addStudentToCourse;
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
        removeStudentFromCourse(studentId: $studentId, courseId: $courseId) {
          success
          message
        }
      }
    `;
    const data = await graphqlRequest(DJANGO_GRAPHQL_ENDPOINT, mutation, {
      studentId: parseInt(studentId),
      courseId: parseInt(courseId),
    });
    return data.removeStudentFromCourse;
  },
};
