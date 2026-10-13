import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchPendingAlumni, approveAlumni } from '../features/alumniSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatDate, initials } from '../utils/format.js';

export default function AdminApprovals() {
  const dispatch = useDispatch();
  const { pending, loading } = useSelector((s) => s.alumni);

  useEffect(() => {
    dispatch(fetchPendingAlumni());
  }, [dispatch]);

  const approve = async (userId) => {
    const res = await dispatch(approveAlumni(userId));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Alumni approved.' }));
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Approval failed' }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Alumni Approvals</h1>
          <p className="subtitle">Verify alumni registrations before they appear in the directory.</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : pending.length === 0 ? (
        <EmptyState icon="✅" title="No pending approvals" hint="All alumni registrations are verified." />
      ) : (
        <div className="grid grid-2">
          {pending.map((u) => (
            <div className="card flex between center" key={u._id}>
              <div className="flex center gap">
                <span className="avatar avatar-lg">{initials(u.name)}</span>
                <div>
                  <strong>{u.name}</strong>
                  <div className="muted small">{u.email}</div>
                  <div className="muted small">Registered {formatDate(u.createdAt)}</div>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => approve(u._id)}>Approve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
