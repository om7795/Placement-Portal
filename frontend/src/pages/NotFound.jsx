import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="app-shell">
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn btn-primary mt-2">Back to dashboard</Link>
      </div>
    </div>
  );
}
