# GraphQL Frontend Integration Guide

## 📦 How to Use GraphQL API in React

### Import the GraphQL API

```javascript
import {
  studentGraphQL,
  universityGraphQL,
  getDashboardData,
} from "../../services/graphqlApi";
```

---

## 🎯 Example Usage in Components

### 1. **Get All Students (Simple Query)**

```javascript
import { useState, useEffect } from "react";
import { studentGraphQL } from "../../services/graphqlApi";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentGraphQL.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.fullName} - {student.university?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

### 2. **Create Student (Mutation)**

```javascript
import { useState } from "react";
import { studentGraphQL } from "../../services/graphqlApi";

function CreateStudentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    universityId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newStudent = await studentGraphQL.createStudent(formData);
      console.log("Student created:", newStudent);
      alert("Student created successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        universityId: "",
      });
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="number"
        placeholder="University ID"
        value={formData.universityId}
        onChange={(e) =>
          setFormData({ ...formData, universityId: e.target.value })
        }
      />
      <button type="submit">Create Student</button>
    </form>
  );
}
```

---

### 3. **Update Student**

```javascript
const handleUpdateStudent = async (studentId) => {
  try {
    const updatedData = {
      firstName: "Jane",
      email: "jane.doe@example.com",
    };

    const updated = await studentGraphQL.updateStudent(studentId, updatedData);
    console.log("Student updated:", updated);

    // Refresh the list
    fetchStudents();
  } catch (error) {
    console.error("Error updating student:", error);
  }
};
```

---

### 4. **Delete Student**

```javascript
const handleDeleteStudent = async (studentId) => {
  if (!confirm("Are you sure you want to delete this student?")) {
    return;
  }

  try {
    const success = await studentGraphQL.deleteStudent(studentId);
    if (success) {
      console.log("Student deleted successfully");
      // Refresh the list
      fetchStudents();
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  }
};
```

---

### 5. **Search Students**

```javascript
import { useState } from "react";
import { studentGraphQL } from "../../services/graphqlApi";

function SearchStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const data = await studentGraphQL.searchStudents(searchTerm);
      setResults(data);
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map((student) => (
          <li key={student.id}>{student.fullName}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 6. **Get Students by University**

```javascript
const fetchStudentsByUniversity = async (universityId) => {
  try {
    const students = await studentGraphQL.getStudentsByUniversity(universityId);
    console.log("Students in university:", students);
    setStudents(students);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};
```

---

### 7. **Get Combined Dashboard Data (Multiple Queries in One Request)**

```javascript
import { useState, useEffect } from "react";
import { getDashboardData } from "../../services/graphqlApi";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    students: [],
    universities: [],
    studentStats: null,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Students: {dashboardData.studentStats?.totalStudents}</p>
      <p>Total Universities: {dashboardData.universities?.length}</p>

      <h3>Recent Students</h3>
      <ul>
        {dashboardData.students?.slice(0, 5).map((student) => (
          <li key={student.id}>
            {student.firstName} {student.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 8. **Get Student with Nested University Data**

```javascript
import { getStudentWithUniversity } from "../../services/graphqlApi";

const fetchStudentDetails = async (studentId) => {
  try {
    const student = await getStudentWithUniversity(studentId);
    console.log("Student:", student);
    console.log("University:", student.university);
    console.log("Classmates:", student.university.students);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🆚 GraphQL vs REST Comparison

### **REST API (Your Current api.js)**

```javascript
// Multiple requests needed
const student = await studentAPI.getStudentById(5);
const university = await universityAPI.getUniversityById(student.university.id);

// Over-fetching: Gets ALL fields
// Under-fetching: Need 2 requests
```

### **GraphQL API (New graphqlApi.js)**

```javascript
// One request, exact data needed
const student = await getStudentWithUniversity(5);

// Returns:
// {
//   id: 5,
//   firstName: "John",
//   lastName: "Doe",
//   university: {
//     name: "MIT",
//     students: [...] // All classmates
//   }
// }
```

---

## 🔄 Migration Guide

### **Before (REST):**

```javascript
import { studentAPI } from "../../services/api";

const students = await studentAPI.getAllStudents();
await studentAPI.createStudent(data);
await studentAPI.deleteStudent(id);
```

### **After (GraphQL):**

```javascript
import { studentGraphQL } from "../../services/graphqlApi";

const students = await studentGraphQL.getAllStudents();
await studentGraphQL.createStudent(data);
await studentGraphQL.deleteStudent(id);
```

**Same function names, same parameters!**

---

## 💡 Benefits

1. ✅ **One Request**: Get student + university + classmates in one call
2. ✅ **No Over-fetching**: Request only fields you need
3. ✅ **Type Safety**: GraphQL validates queries
4. ✅ **Better Performance**: Fewer HTTP requests
5. ✅ **Flexible**: Each component requests exactly what it needs

---

## 🚀 Quick Start

1. **Import GraphQL API**:

   ```javascript
   import {
     studentGraphQL,
     universityGraphQL,
   } from "../../services/graphqlApi";
   ```

2. **Use it like REST API**:

   ```javascript
   const students = await studentGraphQL.getAllStudents();
   ```

3. **Enjoy the benefits!** 🎉

---

## 📌 Note

- **REST API (`api.js`)** still works - use for Django backend (courses/enrollments)
- **GraphQL API (`graphqlApi.js`)** - use for Spring Boot backend (students/universities)
- Both can coexist in your application!
