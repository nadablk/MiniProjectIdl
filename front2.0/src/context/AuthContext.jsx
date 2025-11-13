import { useState } from "react";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("philosophe_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const loading = false;

  const login = async (email, password) => {
    // Mock authentication - these are the credentials
    const mockUsers = [
      {
        email: "admin@philo.com",
        password: "azerty",
        role: "admin",
        name: "Admin Philosophe",
      },
      {
        email: "student@philo.com",
        password: "azerty",
        role: "student",
        name: "Student Philosophe",
        studentId: "1",
      },
    ];

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
        ...(foundUser.studentId && { studentId: foundUser.studentId }),
      };
      setUser(userData);
      localStorage.setItem("philosophe_user", JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("philosophe_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
