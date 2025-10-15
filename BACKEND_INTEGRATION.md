# Backend Integration - Student Management System

## Overview

This document describes the Spring Boot backend integration for the Philosophe University Management System.

## Database Schema

### Student Entity

- **Table**: `students`
- **Fields**:
  - `id` (Long, Primary Key, Auto-increment)
  - `first_name` (String, Not Null)
  - `last_name` (String, Not Null)
  - `email` (String, Not Null, Unique)
  - `university_id` (Long, Foreign Key)

### University Entity

- **Table**: `universities`
- **Fields**:
  - `id` (Long, Primary Key, Auto-increment)
  - `name` (String, Not Null)
  - `location` (String, Not Null)

### Relationships

- **Student → University**: Many-to-One (A student belongs to one university)
- **University → Student**: One-to-Many (A university can have multiple students)

## REST API Endpoints

### Student API (`/api/students`)

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| GET    | `/api/students`                           | Get all students                 |
| GET    | `/api/students/{id}`                      | Get student by ID                |
| POST   | `/api/students`                           | Create new student               |
| PUT    | `/api/students/{id}`                      | Update student                   |
| DELETE | `/api/students/{id}`                      | Delete student                   |
| GET    | `/api/students/search?query={query}`      | Search students by name or email |
| GET    | `/api/students/university/{universityId}` | Get students by university       |
| GET    | `/api/students/stats`                     | Get student statistics           |

### University API (`/api/universities`)

| Method | Endpoint                               | Description                 |
| ------ | -------------------------------------- | --------------------------- |
| GET    | `/api/universities`                    | Get all universities        |
| GET    | `/api/universities/{id}`               | Get university by ID        |
| POST   | `/api/universities`                    | Create new university       |
| PUT    | `/api/universities/{id}`               | Update university           |
| DELETE | `/api/universities/{id}`               | Delete university           |
| GET    | `/api/universities/search?name={name}` | Search universities by name |

## Sample Requests

### Create Student

```json
POST /api/students
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@philosophe.edu",
  "university": {
    "id": 1
  }
}
```

### Update Student

```json
PUT /api/students/1
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@philosophe.edu",
  "university": {
    "id": 2
  }
}
```

### Search Students

```
GET /api/students/search?query=john
```

## Frontend Integration

### API Service (`src/services/api.js`)

The frontend uses a centralized API service with the following methods:

**Student API:**

- `getAllStudents()` - Fetch all students
- `getStudentById(id)` - Fetch student by ID
- `createStudent(student)` - Create new student
- `updateStudent(id, student)` - Update student
- `deleteStudent(id)` - Delete student
- `searchStudents(query)` - Search students
- `getStudentsByUniversity(universityId)` - Filter by university
- `getStudentStats()` - Get statistics

**University API:**

- `getAllUniversities()` - Fetch all universities
- `getUniversityById(id)` - Fetch university by ID
- `createUniversity(university)` - Create new university
- `updateUniversity(id, university)` - Update university
- `deleteUniversity(id)` - Delete university
- `searchUniversities(name)` - Search universities

### Updated Components

#### Dashboard (`src/admin/pages/dashboard.jsx`)

- Removed: System Status and Upcoming Events sections
- Added: Real-time student count from backend API
- Features: Loading states and error handling

#### Students Page (`src/admin/pages/Students.jsx`)

- Changed from static data to dynamic API calls
- Features:
  - Real-time data fetching from backend
  - Search functionality with debouncing (500ms)
  - Add student with university selection
  - Delete student with confirmation
  - Loading states and error banners
  - Display university name and location

## Configuration

### Backend (Spring Boot)

- **Server Port**: 8081
- **Database**: MySQL (localhost:3306/philosophe)
- **CORS**: Enabled for http://localhost:5173

### Frontend (React + Vite)

- **Dev Server**: localhost:5173
- **API Base URL**: http://localhost:8081/api

## Running the Application

### 1. Start Backend

```bash
cd Backend_spring
./mvnw spring-boot:run
```

### 2. Start Frontend

```bash
cd Front-end
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8081/api

## Sample Data

The backend automatically initializes with sample data:

- **4 Universities**: Sorbonne, Oxford, Harvard, Cambridge
- **8 Students**: Distributed across the universities

## Features Implemented

✅ Student CRUD operations (Create, Read, Update, Delete)
✅ University management
✅ Search students by name or email
✅ Filter students by university
✅ Real-time statistics
✅ Error handling and loading states
✅ CORS configuration for frontend-backend communication
✅ Automatic database initialization

## Next Steps

- [ ] Implement Course entity and API
- [ ] Add authentication/authorization
- [ ] Implement pagination for large datasets
- [ ] Add validation and error messages
- [ ] Create edit student functionality
- [ ] Add student details view
- [ ] Implement filtering by status (Active/Graduated)
