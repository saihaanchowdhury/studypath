import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";




function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));




  const [formData, setFormData] = useState({
    subject: "Math",
    gradeLevel: "Kindergarten",
    mode: "Explain This",
    question: "",
  });



  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };




  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setAiResponse("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://studypath-backend.onrender.com/api/tutor/ask",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );




      setAiResponse(response.data.session.aiResponse);
      setFormData({
        ...formData,
        question: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong while asking StudyPath."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          StudyPath
        </Link>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="active">
            New Session
          </Link>
          <Link to="/history">History</Link>
        </nav>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">AI Tutor Dashboard</p>
            <h1>Welcome{user?.username ? `, ${user.username}` : ""}</h1>
            <p>
              Ask a question and StudyPath will guide you step by step. Your
              sessions are saved automatically.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="tutor-card">
            <h2>Ask StudyPath</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="tutor-form">
              <div className="form-row">
                <label>
                  Subject
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Computer Science</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Grade Level
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                  >

                    <option>Kindergarten</option>
                    <option>1st Grade</option>
                    <option>2nd Grade</option>
                    <option>3rd Grade</option>
                    <option>4th Grade</option>
                    <option>5th Grade</option>
                    <option>6th Grade</option>
                    <option>7th Grade</option>
                    <option>8th Grade</option>
                    <option>9th Grade</option>
                    <option>10th Grade</option>
                    <option>11th Grade</option>
                    <option>12th Grade</option>
                    <option>College</option>
                  </select>
                </label>
              </div>

              <label>
                Learning Mode
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option>Explain This</option>
                  <option>Practice Problems</option>
                  <option>Quiz Me</option>
                  <option>Simplify It</option>
                  <option>Study Plan</option>
                  <option>Writing Coach</option>
                </select>
              </label>

              <label>
                Your Question
                <textarea
                  name="question"
                  placeholder="Example: How do I solve 2x + 5 = 15?"
                  value={formData.question}
                  onChange={handleChange}
                  required
                ></textarea>
              </label>

              <button
                type="submit"
                className="primary-button full-button"
                disabled={loading}
              >
                {loading ? "Thinking..." : "Ask StudyPath"}
              </button>
            </form>
          </section>

          <section className="response-card">
            <h2>AI Tutor Response</h2>

            {!aiResponse && !loading && (
              <p className="empty-state">
                Your tutor response will appear here after you ask a question.
              </p>
            )}

            {loading && <p className="empty-state">StudyPath is thinking...</p>}

            {aiResponse && (
              <div className="ai-response">
               {aiResponse
                .replaceAll("**", "")
                .replaceAll()
                .split("\n")
                .map((line, index) => (
                <p key={index}>{line}</p>
            ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );


}

export default Dashboard;