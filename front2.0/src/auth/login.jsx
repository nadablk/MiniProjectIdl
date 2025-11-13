import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "student") {
          navigate("/student/home");
        }
      } else {
        setError(result.error);
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎓 Philosophe</h1>
          <p>Gateway-Only Frontend</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">🔑 Comptes de démonstration</p>
          <div className="demo-buttons">
            <button
              onClick={() => handleDemoLogin("admin@philo.com", "azerty")}
              className="demo-button admin"
            >
              👨‍💼 Admin
              <small>admin@philo.com / azerty</small>
            </button>
            <button
              onClick={() => handleDemoLogin("student@philo.com", "azerty")}
              className="demo-button student"
            >
              👨‍🎓 Student
              <small>student@philo.com / azerty</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
