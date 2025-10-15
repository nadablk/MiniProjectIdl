import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/login";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/dashboard";
import Students from "./admin/pages/Students";
import Universities from "./admin/pages/Universities";
import Home from "./pages/home";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="universities" element={<Universities />} />
            <Route
              path="courses"
              element={
                <div style={{ padding: "2rem", color: "#603B28" }}>
                  Page Cours - En construction
                </div>
              }
            />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student/home"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Default Route - Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
