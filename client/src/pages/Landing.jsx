import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">StudyPath</div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Your personal AI tutor</p>

          <h1>Learn step by step with your personal AI tutor ^-^ </h1>

          <p className="hero-text">
            StudyPath helps students ask questions, get guided explanations,
            generate practice problems, and save their learning history!
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="primary-button">
              Sign up today!
            </Link>
            <Link to="/login" className="secondary-button">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span></span>
            StudyPath Preview
          </div>

          <div className="preview-box">
            <p className="preview-label">Student Question</p>
            <p>How do I solve 2x + 5 = 15?</p>
          </div>

          <div className="preview-box highlight">
            <p className="preview-label">AI Tutor Response</p>
            <p>
              Let&apos;s solve it step by step. First, subtract 5 from both
              sides...
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>Built for better studying</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Step-by-step help</h3>
            <p>
              Get explanations that guide you through the process instead of
              only giving the final answer.
            </p>
          </div>

          <div className="feature-card">
            <h3>Practice modes</h3>
            <p>
              Choose from explanation, practice problems, quizzes, study plans,
              and writing support.
            </p>
          </div>

          <div className="feature-card">
            <h3>Saved history</h3>
            <p>
              Every tutor session is saved so you can review past questions and
              track what you studied.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 StudyPath. Built as a full-stack AI tutoring app.</p>
      </footer>
    </div>
  );
}

export default Landing;