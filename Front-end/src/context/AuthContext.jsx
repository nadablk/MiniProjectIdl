import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextDefinition";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("philosophe_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: Replace with actual API call to http://localhost:8081/api/auth/login
    // For now, using mock authentication

    // Mock credentials
    const mockUsers = [
      {
        email: "admin@philo.com",
        password: "azerty",
        role: "admin",
        name: "Admin",
      },
      {
        email: "student@philo.com",
        password: "azerty",
        role: "student",
        name: "Jean Dupont",
        studentId: "12345",
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
