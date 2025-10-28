import { useState, useEffect } from "react";
import { universityGraphQL } from "../../services/graphqlApi";
import "../style/Universities.css";

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const data = await universityGraphQL.getAllUniversities();
      setUniversities(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching universities:", err);
      setError("Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUniversities();
      return;
    }

    try {
      setLoading(true);
      const data = await universityGraphQL.searchUniversities(searchTerm);
      setUniversities(data);
      setError(null);
    } catch (err) {
      console.error("Error searching universities:", err);
      setError("Failed to search universities");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUniversity) {
        // Update existing university
        await universityGraphQL.updateUniversity(
          editingUniversity.id,
          formData
        );
      } else {
        // Create new university
        await universityGraphQL.createUniversity(formData);
      }
      setShowModal(false);
      setFormData({ name: "", location: "" });
      setEditingUniversity(null);
      fetchUniversities();
    } catch (err) {
      console.error("Error saving university:", err);
      alert("Failed to save university");
    }
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      location: university.location,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this university? This will also remove all associated students."
      )
    ) {
      return;
    }

    try {
      await universityGraphQL.deleteUniversity(id);
      fetchUniversities();
    } catch (err) {
      console.error("Error deleting university:", err);
      alert("Failed to delete university");
    }
  };

  const handleAddNew = () => {
    setEditingUniversity(null);
    setFormData({ name: "", location: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUniversity(null);
    setFormData({ name: "", location: "" });
  };

  // Trigger search when search term changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchUniversities();
      } else {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const filteredUniversities = universities;

  return (
    <div className="universities-container">
      <div className="page-header">
        <div>
          <h1>University Management</h1>
          <p className="page-subtitle">
            {universities.length} universit
            {universities.length !== 1 ? "ies" : "y"} registered
          </p>
        </div>
        <button className="add-btn" onClick={handleAddNew}>
          <span className="btn-icon">➕</span>
          Add University
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn active" onClick={fetchUniversities}>
            All
          </button>
        </div>
      </div>

      {/* Universities Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading universities...</div>
        ) : (
          <table className="universities-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>University Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.map((university) => (
                <tr key={university.id}>
                  <td>#{university.id}</td>
                  <td>
                    <div className="university-name">
                      <span className="avatar">🎓</span>
                      {university.name}
                    </div>
                  </td>
                  <td>{university.location}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => handleEdit(university)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(university.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit University Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingUniversity ? "Edit University" : "Add University"}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <form className="university-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>University Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="University name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingUniversity ? "Update University" : "Add University"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Universities;
