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
import Courses from "./admin/pages/Courses";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
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
            <Route path="courses" element={<Courses />} />
          </Route>

          {/* Student routes will be added in step 3 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
