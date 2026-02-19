import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <div className="hero">
        <h1>Welcome to Kodbank</h1>
        <p className="hero-subtitle">
          Your modern financial command center. Secure, simple, and built for you.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
