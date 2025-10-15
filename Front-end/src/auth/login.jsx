import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Route based on user role
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'student') {
        navigate('/student/home');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Logo and Title */}
          <div className="login-header">
            <div className="login-logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="28" fill="#603B28" stroke="#603B28" strokeWidth="2"/>
                <text x="30" y="40" fontSize="32" fontWeight="bold" fill="#E8DCCC" textAnchor="middle" fontFamily="Georgia, serif">Φ</text>
              </svg>
            </div>
            <h1>Philosophe</h1>
            <p className="login-subtitle">Système de Gestion Universitaire</p>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@philosophe.edu"
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
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <p className="demo-title">Identifiants de démonstration:</p>
            <div className="demo-accounts">
              <div className="demo-account">
                <strong>Admin:</strong> admin@philo.com / azerty
              </div>
              <div className="demo-account">
                <strong>Étudiant:</strong> student@philo.com / azerty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
