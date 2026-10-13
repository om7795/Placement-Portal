import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { fetchEvents, createEvent, toggleRegister } from '../features/eventsSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatDateTime } from '../utils/format.js';

export default function Events() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, loading } = useSelector((s) => s.events);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'webinar', date: '', mode: 'offline', location: '' });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const canCreate = ['admin', 'alumni'].includes(user?.role);

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(createEvent(form));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Event created.' }));
      setShowForm(false);
      setForm({ title: '', description: '', type: 'webinar', date: '', mode: 'offline', location: '' });
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Could not create event' }));
    }
  };

  const register = async (id) => {
    await dispatch(toggleRegister(id));
    dispatch(showToast({ type: 'info', message: 'Registration updated.' }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p className="subtitle">Placement drives, webinars, workshops and reunions.</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'Create event'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="card" onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="drive">Placement drive</option>
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="reunion">Reunion</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date &amp; time</label>
              <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Venue or meeting link" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button className="btn btn-primary">Publish event</button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon="📅" title="No events scheduled" />
      ) : (
        <div className="grid grid-2">
          {items.map((ev) => {
            const registered = ev.registrations?.some((u) => String(u) === String(user?._id));
            return (
              <div className="card" key={ev._id}>
                <div className="flex between center">
                  <Badge value={ev.type} />
                  <span className="muted small">{formatDateTime(ev.date)}</span>
                </div>
                <h3 className="mt-2" style={{ marginBottom: 4 }}>{ev.title}</h3>
                <p className="muted small">{ev.description}</p>
                <div className="job-meta">
                  <span>{ev.mode === 'online' ? '💻 Online' : '📍 ' + (ev.location || 'On campus')}</span>
                  <span>👥 {ev.registrations?.length || 0} registered</span>
                </div>
                {ev.mode === 'online' && ev.meetingLink && (
                  <a href={ev.meetingLink} target="_blank" rel="noreferrer" className="small" style={{ color: 'var(--primary)' }}>
                    Join link
                  </a>
                )}
                <button
                  className={`btn ${registered ? 'btn-outline' : 'btn-primary'} btn-sm mt-2`}
                  onClick={() => register(ev._id)}
                >
                  {registered ? 'Registered ✓' : 'Register'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
