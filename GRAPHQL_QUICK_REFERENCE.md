# 🚀 Quick Start Guide - GraphQL APIs

## Import GraphQL APIs in Your Components

```javascript
// Import what you need
import {
  studentGraphQL,
  universityGraphQL,
  courseGraphQL,
  enrollmentGraphQL,
} from "../services/graphqlApi";
```

---

## 📚 Course Operations (Django GraphQL)

```javascript
// Get all courses
const courses = await courseGraphQL.getAllCourses();
// Returns: [{ id, name, description }, ...]

// Get course by ID
const course = await courseGraphQL.getCourseById(1);
// Returns: { id, name, description }

// Create course
const result = await courseGraphQL.createCourse({
  name: "Philosophy 101",
  description: "Introduction to Philosophy",
});
// Returns: { success: true, message: "...", course: {...} }

// Update course
const result = await courseGraphQL.updateCourse(1, {
  name: "Updated Name",
  description: "Updated Description",
});
// Returns: { success: true, message: "...", course: {...} }

// Delete course
const result = await courseGraphQL.deleteCourse(1);
// Returns: { success: true, message: "..." }
```

---

## 📝 Enrollment Operations (Django GraphQL)

```javascript
// Get all enrollments
const enrollments = await enrollmentGraphQL.getAllEnrollments();
// Returns: [{ id, studentId, course: {id, name} }, ...]

// Get enrollments by course
const enrollments = await enrollmentGraphQL.getEnrollmentsByCourse(1);
// Returns: [{ id, studentId, course: {...} }, ...]

// Get enrollments by student
const enrollments = await enrollmentGraphQL.getEnrollmentsByStudent(5);
// Returns: [{ id, studentId, course: {...} }, ...]

// Enroll student in course
const result = await enrollmentGraphQL.addStudentToCourse(5, 1);
// studentId: 5, courseId: 1
// Returns: { success: true, message: "...", enrollment: {...} }

// Remove student from course
const result = await enrollmentGraphQL.removeStudentFromCourse(5, 1);
// Returns: { success: true, message: "..." }
```

---

## 👥 Student Operations (Spring GraphQL)

```javascript
// Get all students
const students = await studentGraphQL.getAllStudents();

// Get student by ID
const student = await studentGraphQL.getStudentById(1);

// Search students
const students = await studentGraphQL.searchStudents("John");

// Create student
const student = await studentGraphQL.createStudent({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  universityId: "1",
});

// Update student
const student = await studentGraphQL.updateStudent(1, {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  universityId: "2",
});

// Delete student
const success = await studentGraphQL.deleteStudent(1);
```

---

## 🏫 University Operations (Spring GraphQL)

```javascript
// Get all universities
const universities = await universityGraphQL.getAllUniversities();

// Get university by ID
const university = await universityGraphQL.getUniversityById(1);

// Search universities
const universities = await universityGraphQL.searchUniversities("Harvard");

// Create university
const university = await universityGraphQL.createUniversity({
  name: "Harvard University",
  location: "Cambridge, MA",
});

// Update university
const university = await universityGraphQL.updateUniversity(1, {
  name: "Updated Name",
  location: "New Location",
});

// Delete university
const success = await universityGraphQL.deleteUniversity(1);
```

---

## ⚠️ Error Handling

### Django GraphQL (Courses & Enrollments)

```javascript
try {
  const result = await courseGraphQL.createCourse({...});

  if (result.success) {
    console.log("Success:", result.message);
    console.log("Course:", result.course);
  } else {
    console.error("Failed:", result.message);
  }
} catch (error) {
  console.error("Error:", error.message);
}
```

### Spring GraphQL (Students & Universities)

```javascript
try {
  const student = await studentGraphQL.getStudentById(1);
  console.log("Student:", student);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

## 🔧 Network Configuration

**To change Gateway IP:**

1. Open `Front-end/src/config/apiConfig.js`
2. Change `GATEWAY_HOST`:

```javascript
export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.1.100", // Your Gateway IP
  GATEWAY_PORT: 8080,
};
```

3. Save and refresh browser - Done!

---

## 📡 API Endpoints (Through Gateway)

- **Spring GraphQL:** `http://GATEWAY_HOST:8080/graphql/spring`

  - Students
  - Universities

- **Django GraphQL:** `http://GATEWAY_HOST:8080/graphql/django`
  - Courses
  - Enrollments

All managed automatically through `apiConfig.js`! ✅
