# 🚀 GraphQL Frontend Quick Reference

## 📥 Import

```javascript
import {
  studentGraphQL,
  universityGraphQL,
  getDashboardData,
} from "../../services/graphqlApi";
```

---

## 📋 Common Operations

### **Get All Students**

```javascript
const students = await studentGraphQL.getAllStudents();
// Returns: Array of students with university data
```

### **Get One Student**

```javascript
const student = await studentGraphQL.getStudentById(5);
// Returns: Student object with nested university
```

### **Create Student**

```javascript
await studentGraphQL.createStudent({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  universityId: "1",
});
```

### **Update Student**

```javascript
await studentGraphQL.updateStudent(5, {
  firstName: "Jane",
  email: "jane@example.com",
});
```

### **Delete Student**

```javascript
const success = await studentGraphQL.deleteStudent(5);
```

### **Search Students**

```javascript
const results = await studentGraphQL.searchStudents("john");
```

### **Get Students by University**

```javascript
const students = await studentGraphQL.getStudentsByUniversity(1);
```

---

## 🎯 Real Component Example

```javascript
import { useState, useEffect } from "react";
import { studentGraphQL } from "../../services/graphqlApi";

function MyComponent() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await studentGraphQL.getAllStudents();
    setStudents(data);
  };

  const handleCreate = async (formData) => {
    await studentGraphQL.createStudent(formData);
    loadStudents(); // Refresh
  };

  const handleDelete = async (id) => {
    await studentGraphQL.deleteStudent(id);
    loadStudents(); // Refresh
  };

  return (
    <div>
      {students.map((s) => (
        <div key={s.id}>
          {s.fullName} - {s.university?.name}
          <button onClick={() => handleDelete(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## ⚡ One Request, Multiple Data

```javascript
// Get everything needed for dashboard in ONE request
const { students, universities, studentStats } = await getDashboardData();

console.log(students); // All students
console.log(universities); // All universities
console.log(studentStats); // Statistics
```

---

## 🆚 REST vs GraphQL

| Operation                    | REST                          | GraphQL                           |
| ---------------------------- | ----------------------------- | --------------------------------- |
| **Get student + university** | 2 requests                    | 1 request                         |
| **Get only student name**    | Gets all fields               | Gets only name                    |
| **Search**                   | `studentAPI.searchStudents()` | `studentGraphQL.searchStudents()` |
| **Endpoint**                 | `/api/students`               | `/graphql`                        |

---

## 💡 Key Benefits

1. ✅ **Fewer Requests**: Get related data in one call
2. ✅ **No Over-fetching**: Request only needed fields
3. ✅ **Same API**: Similar function names as REST
4. ✅ **Type Safe**: GraphQL validates your queries
5. ✅ **Better Performance**: Optimized data fetching

---

## 🔧 When to Use What

**Use REST (`api.js`):**

- Django backend (Courses, Enrollments)
- Simple operations
- Legacy code

**Use GraphQL (`graphqlApi.js`):**

- Spring Boot backend (Students, Universities)
- Complex nested data
- New features

---

## 📝 Function Names

### Students

- `getAllStudents()`
- `getStudentById(id)`
- `createStudent(data)`
- `updateStudent(id, data)`
- `deleteStudent(id)`
- `searchStudents(query)`
- `getStudentsByUniversity(universityId)`
- `getStudentStats()`

### Universities

- `getAllUniversities()`
- `getUniversityById(id)`
- `createUniversity(data)`
- `updateUniversity(id, data)`
- `deleteUniversity(id)`
- `searchUniversities(name)`

### Combined

- `getDashboardData()` - Get all data in one request
- `getStudentWithUniversity(id)` - Student with full university details

---

## 🚀 Try It Now!

1. Open `Front-end/src/services/graphqlApi.js`
2. Import it in any component
3. Use it like REST API but get better performance!

**That's it!** Same simple API, better performance! 🎉
