import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar.jsx';
import Loader from './Loader.jsx';

/**
 * Guards a route. Requires a token, and optionally restricts by role.
 * Usage: <ProtectedRoute roles={['admin']}> <Page/> </ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const { token, user, initialized } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // While we validate the token on first load, show a loader
  if (!initialized && !user) {
    return <Loader label="Checking your session\u2026" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
