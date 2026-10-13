import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchNotifications, markRead, markAllRead } from '../features/notificationsSlice.js';
import { formatDateTime } from '../utils/format.js';

export default function Notifications() {
  const dispatch = useDispatch();
  const { items, loading, unreadCount } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="subtitle">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={() => dispatch(markAllRead())}>
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {items.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.read && dispatch(markRead(n._id))}
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border)',
                cursor: n.read ? 'default' : 'pointer',
                background: n.read ? 'transparent' : 'var(--primary-light)',
              }}
            >
              <div className="flex between center">
                <strong>{n.title}</strong>
                <span className="muted small">{formatDateTime(n.createdAt)}</span>
              </div>
              <div className="muted small">{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
