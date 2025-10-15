import { useState } from 'react';
import '../style/Students.css';

const Students = () => {
  const [students] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@philosophe.edu', department: 'Philosophie', year: '2ème année', status: 'Actif' },
    { id: 2, name: 'Marie Martin', email: 'marie.martin@philosophe.edu', department: 'Philosophie', year: '3ème année', status: 'Actif' },
    { id: 3, name: 'Pierre Dubois', email: 'pierre.dubois@philosophe.edu', department: 'Lettres', year: '1ère année', status: 'Actif' },
    { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@philosophe.edu', department: 'Histoire', year: '4ème année', status: 'Actif' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-container">
      <div className="page-header">
        <div>
          <h1>Gestion des Étudiants</h1>
          <p className="page-subtitle">
            {students.length} étudiant{students.length > 1 ? 's' : ''} inscrit{students.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <span className="btn-icon">➕</span>
          Ajouter un Étudiant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn active">Tous</button>
          <button className="filter-btn">Actifs</button>
          <button className="filter-btn">Diplômés</button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Département</th>
              <th>Année</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>#{student.id}</td>
                <td>
                  <div className="student-name">
                    <span className="avatar">👤</span>
                    {student.name}
                  </div>
                </td>
                <td>{student.email}</td>
                <td>
                  <span className="department-badge">{student.department}</span>
                </td>
                <td>{student.year}</td>
                <td>
                  <span className={`status-badge ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="Voir">👁️</button>
                    <button className="action-btn edit" title="Modifier">✏️</button>
                    <button className="action-btn delete" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un Étudiant</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" placeholder="Prénom de l'étudiant" />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" placeholder="Nom de l'étudiant" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@philosophe.edu" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Département</label>
                  <select>
                    <option>Philosophie</option>
                    <option>Lettres</option>
                    <option>Histoire</option>
                    <option>Sciences Humaines</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Année</label>
                  <select>
                    <option>1ère année</option>
                    <option>2ème année</option>
                    <option>3ème année</option>
                    <option>4ème année</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  Ajouter l'Étudiant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
