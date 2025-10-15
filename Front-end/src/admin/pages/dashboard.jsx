import { useState, useEffect } from 'react';
import '../style/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0
  });

  const [recentActivities] = useState([
    { id: 1, type: 'student', action: 'Nouvel étudiant inscrit', name: 'Jean Dupont', time: 'Il y a 2 heures' },
    { id: 2, type: 'course', action: 'Nouveau cours créé', name: 'Philosophie Moderne', time: 'Il y a 5 heures' },
    { id: 3, type: 'student', action: 'Étudiant modifié', name: 'Marie Martin', time: 'Il y a 1 jour' },
  ]);

  useEffect(() => {
    // Simulate fetching data from backend
    // TODO: Replace with actual API calls to http://localhost:8081/api/...
    setStats({
      totalStudents: 1247,
      totalCourses: 156
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p className="dashboard-subtitle">Vue d'ensemble du système Philosophe</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card students">
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalStudents.toLocaleString()}</h3>
            <p className="stat-label">Étudiants</p>
          </div>
          <div className="stat-trend positive">+12% ce mois</div>
        </div>

        <div className="stat-card courses">
          <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalCourses}</h3>
            <p className="stat-label">Cours</p>
          </div>
          <div className="stat-trend neutral">+8 ce semestre</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Activities */}
        <div className="dashboard-card activities-card">
          <div className="card-header">
            <h2>Activités Récentes</h2>
            <button className="view-all-btn">Voir tout</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'student' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  {activity.type === 'course' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  )}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-name">{activity.name}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h2>Actions Rapides</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
              <span className="action-label">Ajouter Étudiant</span>
            </button>
            <button className="quick-action-btn">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="10" y1="9" x2="14" y2="9"></line>
                <line x1="12" y1="7" x2="12" y2="11"></line>
              </svg>
              <span className="action-label">Créer Cours</span>
            </button>
            <button className="quick-action-btn">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="action-label">Générer Rapport</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card system-status-card">
          <div className="card-header">
            <h2>État du Système</h2>
          </div>
          <div className="status-list">
            <div className="status-item">
              <span className="status-label">Base de données</span>
              <span className="status-indicator online">En ligne</span>
            </div>
            <div className="status-item">
              <span className="status-label">Serveur GraphQL</span>
              <span className="status-indicator online">En ligne</span>
            </div>
            <div className="status-item">
              <span className="status-label">Dernière sauvegarde</span>
              <span className="status-value">Il y a 2 heures</span>
            </div>
            <div className="status-item">
              <span className="status-label">Espace disque</span>
              <span className="status-value">78% utilisé</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card events-card">
          <div className="card-header">
            <h2>Événements à Venir</h2>
          </div>
          <div className="events-list">
            <div className="event-item">
              <div className="event-date">
                <span className="date-day">15</span>
                <span className="date-month">OCT</span>
              </div>
              <div className="event-details">
                <h4>Réunion du Corps Enseignant</h4>
                <p>Salle de conférence A - 14:00</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="date-day">18</span>
                <span className="date-month">OCT</span>
              </div>
              <div className="event-details">
                <h4>Début des Inscriptions</h4>
                <p>Semestre d'Hiver 2025</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="date-day">22</span>
                <span className="date-month">OCT</span>
              </div>
              <div className="event-details">
                <h4>Conférence de Philosophie</h4>
                <p>Grand Amphithéâtre - 10:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
