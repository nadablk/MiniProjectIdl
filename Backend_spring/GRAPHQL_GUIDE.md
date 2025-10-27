# GraphQL API Documentation

## Access Points

- **GraphQL Endpoint**: `http://localhost:8081/graphql`
- **GraphiQL UI** (Interactive Testing): `http://localhost:8081/graphiql`

---

## Example Queries

### 1. Get All Students

```graphql
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
```

### 2. Get Single Student by ID

```graphql
query {
  student(id: "1") {
    id
    firstName
    lastName
    email
    university {
      name
    }
  }
}
```

### 3. Search Students

```graphql
query {
  searchStudents(query: "john") {
    id
    firstName
    lastName
    email
  }
}
```

### 4. Get Students by University

```graphql
query {
  studentsByUniversity(universityId: "1") {
    id
    firstName
    lastName
  }
}
```

### 5. Get All Universities

```graphql
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
```

### 6. Get Single University

```graphql
query {
  university(id: "1") {
    name
    location
    students {
      firstName
      lastName
    }
  }
}
```

### 7. Student Statistics

```graphql
query {
  studentStats {
    totalStudents
  }
}
```

---

## Example Mutations

### 1. Create Student

```graphql
mutation {
  createStudent(
    input: {
      firstName: "John"
      lastName: "Doe"
      email: "john.doe@example.com"
      universityId: "1"
    }
  ) {
    id
    firstName
    lastName
    email
    university {
      name
    }
  }
}
```

### 2. Update Student

```graphql
mutation {
  updateStudent(
    id: "1"
    input: { firstName: "Jane", email: "jane.doe@example.com" }
  ) {
    id
    firstName
    lastName
    email
  }
}
```

### 3. Delete Student

```graphql
mutation {
  deleteStudent(id: "1")
}
```

### 4. Create University

```graphql
mutation {
  createUniversity(input: { name: "MIT", location: "Cambridge, MA" }) {
    id
    name
    location
  }
}
```

### 5. Update University

```graphql
mutation {
  updateUniversity(
    id: "1"
    input: {
      name: "Massachusetts Institute of Technology"
      location: "Cambridge, Massachusetts"
    }
  ) {
    id
    name
    location
  }
}
```

### 6. Delete University

```graphql
mutation {
  deleteUniversity(id: "1")
}
```

---

## Advanced Query Examples

### Get Only Specific Fields (Avoid Over-fetching)

```graphql
query {
  students {
    firstName
    email
  }
}
```

### Nested Query with Selective Fields

```graphql
query {
  universities {
    name
    students {
      fullName
      email
    }
  }
}
```

### Multiple Queries in One Request

```graphql
query {
  allStudents: students {
    id
    fullName
  }

  allUniversities: universities {
    id
    name
  }

  stats: studentStats {
    totalStudents
  }
}
```

### Query with Variables

```graphql
query GetStudent($studentId: ID!) {
  student(id: $studentId) {
    firstName
    lastName
    university {
      name
    }
  }
}
```

**Variables:**

```json
{
  "studentId": "1"
}
```

---

## Testing with cURL

### Query Example

```bash
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ students { id firstName lastName } }"}'
```

### Mutation Example

```bash
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createStudent(input: { firstName: \"John\", lastName: \"Doe\", email: \"john@example.com\" }) { id firstName } }"
  }'
```

---

## Using GraphQL from React/JavaScript

```javascript
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
  }
`;

const response = await fetch("http://localhost:8081/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

const data = await response.json();
console.log(data.data.students);
```

---

## Benefits Over REST

### REST Approach (Multiple Requests):

```
GET /api/students/1          → { id: 1, firstName: "John", ... }
GET /api/universities/1       → { id: 1, name: "MIT", ... }
```

### GraphQL Approach (Single Request):

```graphql
query {
  student(id: "1") {
    firstName
    university {
      name
    }
  }
}
```

**Result**: One request, exact data needed, no over-fetching!

---

## Quick Start

1. Start Spring Boot server (it should be running on port 8081)
2. Open browser: `http://localhost:8081/graphiql`
3. Try example queries above
4. Explore the schema using the "Docs" panel on the right

Happy Querying! 🚀
