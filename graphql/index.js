require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");

// Base URLs from environment variables
const STUDENT_BASE = process.env.STUDENT_BASE;
const COURSE_BASE = process.env.COURSE_BASE;
const AI_BASE = process.env.AI_BASE;
const PORT = process.env.PORT || 9000;

// Helper function for fetch with JSON
async function callApi(method, url, body = undefined) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// GraphQL Schema
const typeDefs = gql`
  # ===================================================================
  # STUDENT & UNIVERSITY TYPES (Spring Boot - port 8081)
  # ===================================================================

  type University {
    id: ID!
    name: String!
    location: String!
    students: [Student]
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    university: University
  }

  input StudentInput {
    name: String!
    email: String!
    universityId: ID
  }

  # ===================================================================
  # COURSE & ENROLLMENT TYPES (Django - port 9090)
  # ===================================================================

  type Course {
    id: ID!
    name: String!
    description: String
    credits: Int
    instructor: String
    created_at: String
    updated_at: String
  }

  type Enrollment {
    id: ID!
    student_id: Int!
    student_name: String
    course: Int!
    course_name: String
    grade: String
    enrollment_date: String
    created_at: String
  }

  # ===================================================================
  # AI/CHATBOT TYPES (Chatbot Service - port 8002)
  # ===================================================================

  """
  Translation result with support for multiple languages.
  Supported languages: English (en), French (fr), Spanish (es), German (de),
  Italian (it), Portuguese (pt), Dutch (nl), Russian (ru), Chinese (zh),
  Japanese (ja), Arabic (ar)

  Language codes can be specified as:
  - Standard codes: en, fr, es, de, it, pt, nl, ru, zh, ja, ar
  - Full names: english, french, spanish, german, italian, portuguese, etc.

  For unsupported direct pairs, translation will attempt via English.
  """
  type TranslationResult {
    success: Boolean!
    originalText: String
    translatedText: String
    sourceLang: String
    targetLang: String
    error: String
  }

  type SummarizationResult {
    success: Boolean!
    originalText: String
    summary: String
    originalLength: Int
    summaryLength: Int
    error: String
  }

  type HealthStatus {
    success: Boolean!
    status: String
    service: String
    version: String
  }

  # ===================================================================
  # QUERIES
  # ===================================================================

  type Query {
    # Students & Universities (Spring Boot)
    allStudents: [Student]
    student(id: ID!): Student
    studentByName(name: String!): Student

    allUniversities: [University]
    university(id: ID!): University
    universityByName(name: String!): University

    # Courses & Enrollments (Django)
    allCourses: [Course]
    course(id: ID!): Course

    allEnrollments: [Enrollment]
    enrollmentsByCourse(courseId: Int!): [Enrollment]
    enrollmentsByStudent(studentId: Int!): [Enrollment]

    # Chatbot Health
    chatbotHealth: HealthStatus
  }

  # ===================================================================
  # MUTATIONS
  # ===================================================================

  type Mutation {
    # Student Mutations (Spring Boot)
    createStudent(
      firstName: String!
      lastName: String!
      email: String!
      universityId: ID
    ): Student
    updateStudent(
      id: ID!
      firstName: String
      lastName: String
      email: String
      universityId: ID
    ): Student
    deleteStudent(id: ID!): Boolean

    # University Mutations (Spring Boot)
    createUniversity(name: String!, location: String!): University
    updateUniversity(id: ID!, name: String, location: String): University
    deleteUniversity(id: ID!): Boolean

    # Course Mutations (Django)
    createCourse(
      name: String!
      description: String
      credits: Int
      instructor: String
    ): Course
    updateCourse(
      id: ID!
      name: String
      description: String
      credits: Int
      instructor: String
    ): Course
    deleteCourse(id: ID!): Boolean

    # Enrollment Mutations (Django)
    addStudentToCourse(
      studentId: Int!
      courseId: Int!
      grade: String
    ): Enrollment
    updateEnrollment(
      id: ID!
      studentId: Int
      courseId: Int
      grade: String
    ): Enrollment
    removeStudentFromCourse(studentId: Int!, courseId: Int!): Boolean

    # AI/Chatbot Mutations
    """
    Translate text between multiple languages.

    Supported language codes (case-insensitive):
    - en, english: English
    - fr, french, francais: French
    - es, spanish, espanol: Spanish
    - de, german, deutsch: German
    - it, italian, italiano: Italian
    - pt, portuguese, portugues: Portuguese
    - nl, dutch, nederlands: Dutch
    - ru, russian: Russian
    - zh, chinese: Chinese
    - ja, japanese: Japanese
    - ar, arabic: Arabic

    Examples:
    - translate(text: "Hello", sourceLang: "en", targetLang: "fr")
    - translate(text: "Bonjour", sourceLang: "french", targetLang: "english")
    - translate(text: "Hola", sourceLang: "es", targetLang: "de")

    Note: For unsupported direct pairs, translation will route through English.
    """
    translate(
      text: String!
      sourceLang: String!
      targetLang: String!
    ): TranslationResult

    """
    Summarize long text into a shorter version.

    Parameters:
    - text: The text to summarize (should be at least 30 words)
    - maxLength: Maximum length of summary (default: 130)
    - minLength: Minimum length of summary (default: 30)
    """
    summarize(
      text: String!
      maxLength: Int
      minLength: Int
    ): SummarizationResult
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // ===================================================================
    // STUDENTS & UNIVERSITIES (Spring Boot)
    // ===================================================================
    allStudents: async () => {
      return callApi("GET", `${STUDENT_BASE}/students`);
    },
    student: async (_, { id }) => {
      return callApi("GET", `${STUDENT_BASE}/students/${id}`);
    },
    studentByName: async (_, { name }) => {
      const students = await callApi("GET", `${STUDENT_BASE}/students`);
      return students.find(
        (s) =>
          (s.firstName + " " + s.lastName)
            .toLowerCase()
            .includes(name.toLowerCase()) ||
          s.firstName.toLowerCase().includes(name.toLowerCase()) ||
          s.lastName.toLowerCase().includes(name.toLowerCase())
      );
    },

    allUniversities: async () => {
      return callApi("GET", `${STUDENT_BASE}/universities`);
    },
    university: async (_, { id }) => {
      return callApi("GET", `${STUDENT_BASE}/universities/${id}`);
    },
    universityByName: async (_, { name }) => {
      const universities = await callApi("GET", `${STUDENT_BASE}/universities`);
      return universities.find((u) =>
        u.name.toLowerCase().includes(name.toLowerCase())
      );
    },

    // ===================================================================
    // COURSES & ENROLLMENTS (Django)
    // ===================================================================
    allCourses: async () => {
      return callApi("GET", `${COURSE_BASE}/courses/`);
    },
    course: async (_, { id }) => {
      return callApi("GET", `${COURSE_BASE}/courses/${id}/`);
    },

    allEnrollments: async () => {
      return callApi("GET", `${COURSE_BASE}/enrollments/`);
    },
    enrollmentsByCourse: async (_, { courseId }) => {
      return callApi(
        "GET",
        `${COURSE_BASE}/enrollments/?course_id=${courseId}`
      );
    },
    enrollmentsByStudent: async (_, { studentId }) => {
      return callApi(
        "GET",
        `${COURSE_BASE}/enrollments/?student_id=${studentId}`
      );
    },

    // ===================================================================
    // CHATBOT
    // ===================================================================
    chatbotHealth: async () => {
      try {
        const result = await callApi("GET", `${AI_BASE}/health/`);
        return {
          success: true,
          status: "healthy",
          service: "chatbot",
          version: "1.0",
        };
      } catch (error) {
        return {
          success: false,
          status: "unhealthy",
          service: "chatbot",
          version: "1.0",
        };
      }
    },
  },

  Mutation: {
    // ===================================================================
    // STUDENTS (Spring Boot)
    // ===================================================================
    createStudent: async (_, { firstName, lastName, email, universityId }) => {
      const body = {
        firstName,
        lastName,
        email,
        university: universityId ? { id: Number(universityId) } : null,
      };
      return callApi("POST", `${STUDENT_BASE}/students`, body);
    },
    updateStudent: async (
      _,
      { id, firstName, lastName, email, universityId }
    ) => {
      const body = {};
      if (firstName) body.firstName = firstName;
      if (lastName) body.lastName = lastName;
      if (email) body.email = email;
      if (universityId) body.university = { id: Number(universityId) };
      return callApi("PUT", `${STUDENT_BASE}/students/${id}`, body);
    },
    deleteStudent: async (_, { id }) => {
      try {
        await callApi("DELETE", `${STUDENT_BASE}/students/${id}`);
        return true;
      } catch (error) {
        console.error("Error deleting student:", error);
        return false;
      }
    },

    // ===================================================================
    // UNIVERSITIES (Spring Boot)
    // ===================================================================
    createUniversity: async (_, { name, location }) => {
      return callApi("POST", `${STUDENT_BASE}/universities`, {
        name,
        location,
      });
    },
    updateUniversity: async (_, { id, name, location }) => {
      const body = {};
      if (name) body.name = name;
      if (location) body.location = location;
      return callApi("PUT", `${STUDENT_BASE}/universities/${id}`, body);
    },
    deleteUniversity: async (_, { id }) => {
      try {
        await callApi("DELETE", `${STUDENT_BASE}/universities/${id}`);
        return true;
      } catch (error) {
        console.error("Error deleting university:", error);
        return false;
      }
    },

    // ===================================================================
    // COURSES (Django)
    // ===================================================================
    createCourse: async (_, { name, description, credits, instructor }) => {
      const body = { name };
      if (description) body.description = description;
      if (credits) body.credits = credits;
      if (instructor) body.instructor = instructor;
      return callApi("POST", `${COURSE_BASE}/courses/`, body);
    },
    updateCourse: async (_, { id, name, description, credits, instructor }) => {
      const body = {};
      if (name) body.name = name;
      if (description) body.description = description;
      if (credits) body.credits = credits;
      if (instructor) body.instructor = instructor;
      return callApi("PUT", `${COURSE_BASE}/courses/${id}/`, body);
    },
    deleteCourse: async (_, { id }) => {
      try {
        await callApi("DELETE", `${COURSE_BASE}/courses/${id}/`);
        return true;
      } catch (error) {
        console.error("Error deleting course:", error);
        return false;
      }
    },

    // ===================================================================
    // ENROLLMENTS (Django)
    // ===================================================================
    addStudentToCourse: async (_, { studentId, courseId, grade }) => {
      const body = {
        student_id: studentId,
        course: courseId,
      };
      if (grade !== null && grade !== undefined) body.grade = grade;
      return callApi("POST", `${COURSE_BASE}/enrollments/`, body);
    },
    updateEnrollment: async (_, { id, studentId, courseId, grade }) => {
      const body = {};
      if (studentId !== undefined) body.student_id = studentId;
      if (courseId !== undefined) body.course = courseId;
      if (grade !== undefined) body.grade = grade;
      return callApi("PUT", `${COURSE_BASE}/enrollments/${id}/`, body);
    },
    removeStudentFromCourse: async (_, { studentId, courseId }) => {
      // Find the enrollment first
      const enrollments = await callApi(
        "GET",
        `${COURSE_BASE}/enrollments/?student_id=${studentId}&course=${courseId}`
      );
      if (enrollments && enrollments.length > 0) {
        await callApi(
          "DELETE",
          `${COURSE_BASE}/enrollments/${enrollments[0].id}/`
        );
        return true;
      }
      return false;
    },

    // ===================================================================
    // AI/CHATBOT
    // ===================================================================
    translate: async (_, { text, sourceLang, targetLang }) => {
      try {
        const result = await callApi("POST", `${AI_BASE}/translate/`, {
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
        });
        return {
          success: true,
          originalText: text,
          translatedText: result.translated_text || result,
          sourceLang,
          targetLang,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          originalText: text,
          translatedText: null,
          sourceLang,
          targetLang,
          error: error.message,
        };
      }
    },
    summarize: async (_, { text, maxLength, minLength }) => {
      try {
        // Provide default values that meet chatbot service constraints:
        // max_length must be <= 500, min_length must be >= 10
        const requestBody = {
          text,
          max_length: maxLength || 150, // Default max length (must be <= 500)
          min_length: minLength || 30, // Default min length (must be >= 10)
        };

        const result = await callApi(
          "POST",
          `${AI_BASE}/summarize/`,
          requestBody
        );

        // Check if the result contains an error or validation errors
        if (result.error || result.max_length || result.min_length) {
          const errorMsg =
            result.error ||
            `Validation error: max_length=${result.max_length}, min_length=${result.min_length}`;
          return {
            success: false,
            originalText: text,
            summary: null,
            originalLength: text.length,
            summaryLength: 0,
            error: errorMsg,
          };
        }

        return {
          success: true,
          originalText: text,
          summary: result.summary || result,
          originalLength: text.length,
          summaryLength: (result.summary || result).length,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          originalText: text,
          summary: null,
          originalLength: text.length,
          summaryLength: 0,
          error: error.message || "Failed to summarize text",
        };
      }
    },
  },
};

// Start Apollo Server
// CORS is disabled here because Spring Gateway (port 9091) handles CORS
// The Gateway sits in front of this GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  cors: false, // Disable CORS - handled by Spring Gateway
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 GraphQL Gateway running at ${url}`);
  console.log(`📍 Student Service: ${STUDENT_BASE}`);
  console.log(`📍 Course Service: ${COURSE_BASE}`);
  console.log(`📍 AI Service: ${AI_BASE}`);
  console.log(`⚠️  CORS handled by Spring Gateway (port 9091)`);
});
