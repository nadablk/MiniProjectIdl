import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="student-home">
      {/* Header */}
      <header className="student-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#E8DCCC" stroke="#E8DCCC" strokeWidth="2"/>
                <text x="20" y="27" fontSize="20" fontWeight="bold" fill="#603B28" textAnchor="middle" fontFamily="Georgia, serif">Φ</text>
              </svg>
            </div>
            <h1 className="system-name">Philosophe</h1>
          </div>

          <nav className="student-nav">
            <a href="#" className="nav-link active">Accueil</a>
            <a href="#" className="nav-link">Mes Cours</a>
            <a href="#" className="nav-link">Notes</a>
            <a href="#" className="nav-link">Emploi du Temps</a>
          </nav>

          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.name || 'Étudiant'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="student-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Bienvenue, {user?.name || 'Étudiant'}!</h2>
          <p>Numéro d'étudiant: {user?.studentId || 'N/A'}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="student-dashboard">
          {/* My Courses */}
          <div className="dashboard-card courses-card">
            <div className="card-header">
              <h3>Mes Cours</h3>
              <span className="badge">5 cours</span>
            </div>
            <div className="courses-list">
              <div className="course-item">
                <div className="course-icon">📖</div>
                <div className="course-info">
                  <h4>Philosophie Moderne</h4>
                  <p>Prof. Dr. Marie Lambert</p>
                </div>
                <span className="course-status ongoing">En cours</span>
              </div>
              <div className="course-item">
                <div className="course-icon">📚</div>
                <div className="course-info">
                  <h4>Histoire de la Philosophie</h4>
                  <p>Prof. Dr. Jean Martin</p>
                </div>
                <span className="course-status ongoing">En cours</span>
              </div>
              <div className="course-item">
                <div className="course-icon">🎓</div>
                <div className="course-info">
                  <h4>Éthique et Morale</h4>
                  <p>Prof. Dr. Sophie Bernard</p>
                </div>
                <span className="course-status ongoing">En cours</span>
              </div>
            </div>
          </div>

          {/* Grades */}
          <div className="dashboard-card grades-card">
            <div className="card-header">
              <h3>Dernières Notes</h3>
              <a href="#" className="view-all">Voir tout</a>
            </div>
            <div className="grades-list">
              <div className="grade-item">
                <div className="grade-subject">
                  <span className="subject-name">Philosophie Moderne</span>
                  <span className="grade-date">12 Oct 2025</span>
                </div>
                <span className="grade-value excellent">18/20</span>
              </div>
              <div className="grade-item">
                <div className="grade-subject">
                  <span className="subject-name">Histoire</span>
                  <span className="grade-date">10 Oct 2025</span>
                </div>
                <span className="grade-value good">15/20</span>
              </div>
              <div className="grade-item">
                <div className="grade-subject">
                  <span className="subject-name">Éthique</span>
                  <span className="grade-date">8 Oct 2025</span>
                </div>
                <span className="grade-value excellent">17/20</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="dashboard-card schedule-card">
            <div className="card-header">
              <h3>Emploi du Temps - Aujourd'hui</h3>
            </div>
            <div className="schedule-list">
              <div className="schedule-item">
                <div className="time-badge">09:00</div>
                <div className="schedule-info">
                  <h4>Philosophie Moderne</h4>
                  <p>Salle A203 - Dr. Lambert</p>
                </div>
              </div>
              <div className="schedule-item">
                <div className="time-badge">11:00</div>
                <div className="schedule-info">
                  <h4>Histoire de la Philosophie</h4>
                  <p>Amphithéâtre B - Dr. Martin</p>
                </div>
              </div>
              <div className="schedule-item">
                <div className="time-badge">14:00</div>
                <div className="schedule-info">
                  <h4>Séminaire Éthique</h4>
                  <p>Salle C105 - Dr. Bernard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="dashboard-card announcements-card">
            <div className="card-header">
              <h3>Annonces</h3>
            </div>
            <div className="announcements-list">
              <div className="announcement-item">
                <span className="announcement-icon">📢</span>
                <div className="announcement-content">
                  <h4>Réunion du Corps Étudiant</h4>
                  <p>15 Octobre 2025 - 14:00, Salle de conférence A</p>
                </div>
              </div>
              <div className="announcement-item">
                <span className="announcement-icon">📝</span>
                <div className="announcement-content">
                  <h4>Début des Inscriptions</h4>
                  <p>Semestre d'Hiver 2025 - à partir du 18 Octobre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
