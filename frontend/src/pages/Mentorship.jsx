import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import {
  fetchMentors,
  fetchMyMentorship,
  requestMentorship,
  respondMentorship,
} from '../features/alumniSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatDateTime, initials } from '../utils/format.js';

export default function Mentorship() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { mentors, mentorship, loading } = useSelector((s) => s.alumni);
  const [form, setForm] = useState({ alumniId: '', topic: '', message: '' });

  useEffect(() => {
    dispatch(fetchMyMentorship());
    if (user?.role === 'student') dispatch(fetchMentors());
  }, [dispatch, user?.role]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(requestMentorship(form));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Mentorship request sent.' }));
      setForm({ alumniId: '', topic: '', message: '' });
      dispatch(fetchMyMentorship());
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Could not send request' }));
    }
  };

  const respond = async (id, status) => {
    const res = await dispatch(respondMentorship({ id, status, response: status === 'accepted' ? 'Happy to help!' : '' }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: `Request ${status}.` }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Mentorship</h1>
          <p className="subtitle">
            {user?.role === 'student'
              ? 'Request guidance from alumni mentors.'
              : 'Respond to mentorship requests from juniors.'}
          </p>
        </div>
      </div>

      {user?.role === 'student' && (
        <form className="card" onSubmit={submit}>
          <h3>Request a mentor</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Choose a mentor</label>
              <select required value={form.alumniId} onChange={(e) => setForm({ ...form, alumniId: e.target.value })}>
                <option value="">Select an alumni</option>
                {mentors.map((m) => (
                  <option key={m._id} value={m.user?._id}>
                    {m.user?.name} — {m.designation} at {m.company}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Topic</label>
              <input required value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. System design prep" />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Briefly describe what you need help with." />
          </div>
          <button className="btn btn-primary" disabled={mentors.length === 0}>Send request</button>
        </form>
      )}

      <h3 className="mt-3">{user?.role === 'student' ? 'My requests' : 'Requests received'}</h3>
      {loading ? (
        <Loader />
      ) : mentorship.length === 0 ? (
        <EmptyState icon="🤝" title="No mentorship requests yet" />
      ) : (
        <div className="grid grid-2">
          {mentorship.map((m) => {
            const other = user?.role === 'student' ? m.alumni : m.student;
            return (
              <div className="card" key={m._id}>
                <div className="flex between center">
                  <div className="flex center gap">
                    <span className="avatar">{initials(other?.name)}</span>
                    <div>
                      <strong>{other?.name}</strong>
                      <div className="muted small">{user?.role === 'student' ? 'Mentor' : 'Student'}</div>
                    </div>
                  </div>
                  <Badge value={m.status} />
                </div>
                <h4 className="mt-2" style={{ marginBottom: 4 }}>{m.topic}</h4>
                <p className="muted small">{m.message}</p>
                {m.response && <div className="alert alert-info small mb-0">{m.response}</div>}
                {m.scheduledAt && <div className="muted small mt-1">Scheduled: {formatDateTime(m.scheduledAt)}</div>}

                {user?.role === 'alumni' && m.status === 'pending' && (
                  <div className="flex gap mt-2">
                    <button className="btn btn-primary btn-sm" onClick={() => respond(m._id, 'accepted')}>Accept</button>
                    <button className="btn btn-outline btn-sm" onClick={() => respond(m._id, 'declined')}>Decline</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
