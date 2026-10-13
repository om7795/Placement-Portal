import { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice.js';
import { fetchUnreadCount } from '../features/notificationsSlice.js';
import { initials } from '../utils/format.js';

const LINKS_BY_ROLE = {
  student: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/applications', label: 'Applications' },
    { to: '/alumni', label: 'Alumni' },
    { to: '/events', label: 'Events' },
  ],
  alumni: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/post-job', label: 'Post Referral' },
    { to: '/mentorship', label: 'Mentorship' },
    { to: '/alumni', label: 'Directory' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/alumni', label: 'Approvals' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/post-job', label: 'Post Job' },
    { to: '/events', label: 'Events' },
  ],
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const unread = useSelector((s) => s.notifications.unreadCount);

  useEffect(() => {
    if (user) dispatch(fetchUnreadCount());
  }, [dispatch, user]);

  const links = LINKS_BY_ROLE[user?.role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark">P</span>
        <span>Placement Portal</span>
      </Link>

      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            end={l.to === '/admin'}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-user">
        <Link to="/notifications" className="bell" title="Notifications">
          {'\u{1F514}'}
          {unread > 0 && <span className="dot">{unread > 9 ? '9+' : unread}</span>}
        </Link>
        <Link to="/profile" className="flex center gap" title="My profile">
          <span className="avatar">{initials(user?.name)}</span>
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
