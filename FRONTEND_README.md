# Philosophe - Système de Gestion Universitaire

## ✅ Project Summary

Professional university management system with admin and student interfaces built with React.js and Spring Boot.

### 🎨 Design
- **Primary Color**: `#603B28` (Brown - Navigation bars)
- **Secondary Color**: `#E8DCCC` (Cream - Page backgrounds)
- **Accent Color**: `#8B5A3C` (Light Brown)

### 🔐 Authentication System

#### Login Credentials
**Admin Access:**
- Email: `admin@philo.com`
- Password: `azerty`
- Redirects to: `/admin/dashboard`

**Student Access:**
- Email: `student@philo.com`
- Password: `azerty`
- Redirects to: `/student/home`

#### Features
- Protected routes based on user roles
- Persistent login (localStorage)
- Beautiful animated login page
- Role-based navigation

### 📁 Project Structure

```
Front-end/
├── src/
│   ├── admin/                    # Admin interface
│   │   ├── AdminLayout.jsx       # Admin layout with navigation
│   │   ├── pages/
│   │   │   ├── dashboard.jsx     # Admin dashboard
│   │   │   └── Students.jsx      # Student management
│   │   └── style/                # Admin-specific styles
│   │       ├── AdminLayout.css
│   │       ├── dashboard.css
│   │       └── Students.css
│   │
│   ├── auth/                     # Authentication
│   │   └── login.jsx             # Login page
│   │
│   ├── pages/                    # Student pages
│   │   └── home.jsx              # Student home page
│   │
│   ├── style/                    # General/Student styles
│   │   ├── login.css
│   │   └── home.css
│   │
│   ├── context/                  # State management
│   │   ├── AuthContextDefinition.jsx
│   │   └── AuthContext.jsx       # Auth provider
│   │
│   ├── hooks/                    # Custom hooks
│   │   └── useAuth.js            # Auth hook
│   │
│   ├── components/               # Shared components
│   │   └── ProtectedRoute.jsx   # Route protection
│   │
│   ├── App.jsx                   # Main app with routing
│   └── main.jsx                  # Entry point

Backend_spring/
└── src/main/resources/
    └── application.properties    # Port: 8081
```

### 🎯 Completed Features

#### Admin Interface ✅
- **Professional Dashboard**
  - Statistics cards (Students, Teachers, Courses, Departments)
  - Recent activities feed
  - Quick action buttons
  - System status monitoring
  - Upcoming events calendar
  
- **Student Management Page**
  - Student table with search
  - Filter by status
  - Add/Edit/Delete students
  - Modal form for adding students
  
- **Navigation**
  - Top navigation bar with Philosophe logo
  - Links: Dashboard, Students, Teachers, Courses, Departments
  - User info display
  - Logout functionality

#### Student Interface ✅
- **Home Page**
  - Welcome section with student info
  - My Courses section
  - Recent grades display
  - Today's schedule
  - Announcements
  
- **Navigation**
  - Home, My Courses, Notes, Schedule
  - User profile display
  - Logout functionality

#### Authentication ✅
- **Login Page**
  - Beautiful animated gradient background
  - Professional form design
  - Error handling
  - Remember me option
  - Demo credentials display
  
- **Security**
  - Role-based access control
  - Protected routes
  - Persistent sessions
  - Automatic redirects

### 🚀 How to Run

#### Backend (Spring Boot)
```powershell
cd "Backend_spring"
./mvnw spring-boot:run
```
Server runs on: `http://localhost:8081`

#### Frontend (React)
```powershell
cd "Front-end"
npm run dev
```
App runs on: `http://localhost:5173`

### 📋 Next Steps

1. **Complete Admin Pages**
   - Teachers management
   - Courses management
   - Departments management

2. **Backend Integration**
   - Connect to Spring Boot API (port 8081)
   - Implement GraphQL queries
   - Real authentication with database

3. **Additional Features**
   - Student course registration
   - Grade management
   - Schedule management
   - File uploads
   - Reports generation

### 🎨 Style Organization

- **Admin styles**: `src/admin/style/`
- **Student/General styles**: `src/style/`
- **Global styles**: `src/index.css`

### 📦 Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^6.x.x"
}
```

### 🔧 Configuration

**Backend Port**: 8081 (configured in `application.properties`)
**Frontend Port**: 5173 (Vite default)

---

## 🎓 Current Status

✅ Authentication system fully functional
✅ Admin dashboard complete
✅ Student home page complete
✅ Professional UI with university standards
🔄 Additional admin pages in progress
🔄 Backend API integration pending

**Last Updated**: October 15, 2025
