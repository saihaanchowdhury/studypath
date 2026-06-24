import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://studypath-fv08.onrender.com";

function History() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cleanText = (text) => {
    return text.replaceAll("**", "").replaceAll("*", "");
  };

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/tutor/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong while loading your history."
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (session) => {
    setEditingId(session._id);
    setEditedTitle(session.title);
  };

  const cancelEditing = () => {
    setEditingId("");
    setEditedTitle("");
  };

  const saveTitle = async (sessionId) => {
    if (!editedTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/tutor/sessions/${sessionId}`,
        {
          title: editedTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions(
        sessions.map((session) =>
          session._id === sessionId ? response.data.session : session
        )
      );

      setEditingId("");
      setEditedTitle("");
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong while updating the session."
      );
    }
  };

  const handleDelete = async (sessionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this session?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/tutor/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions(sessions.filter((session) => session._id !== sessionId));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong while deleting the session."
      );
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          StudyPath
        </Link>

        <nav className="sidebar-nav">
          <Link to="/dashboard">New Session</Link>
          <Link to="/history" className="active">
            History
          </Link>
        </nav>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Saved Sessions</p>
            <h1>Your Study History</h1>
            <p>Review, edit, and delete your previous AI tutor sessions.</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="history-card">
            <p className="empty-state">Loading your history...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="history-card">
            <p className="empty-state">
              No sessions yet. Ask StudyPath a question to create your first
              saved session.
            </p>
          </div>
        ) : (
          <div className="history-list">
            {sessions.map((session) => (
              <div className="history-card" key={session._id}>
                <div className="history-top">
                  <div className="history-title-area">
                    {editingId === session._id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(event) =>
                          setEditedTitle(event.target.value)
                        }
                        className="edit-title-input"
                      />
                    ) : (
                      <h2>{session.title}</h2>
                    )}

                    <p>
                      {session.subject} • {session.gradeLevel} • {session.mode}
                    </p>
                  </div>

                  <div className="history-actions">
                    {editingId === session._id ? (
                      <>
                        <button
                          className="small-button"
                          onClick={() => saveTitle(session._id)}
                        >
                          Save
                        </button>

                        <button
                          className="small-button secondary-small-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="small-button"
                        onClick={() => startEditing(session)}
                      >
                        Edit Title
                      </button>
                    )}

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(session._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="history-question">
                  <strong>Question:</strong>
                  <p>{session.question}</p>
                </div>

                <div className="history-response">
                  <strong>AI Response:</strong>
                  <p>{cleanText(session.aiResponse)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;