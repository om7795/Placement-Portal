import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { fetchMyApplications, withdrawApplication } from '../features/applicationsSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatDate, formatCompensation } from '../utils/format.js';

export default function Applications() {
  const dispatch = useDispatch();
  const { mine, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const withdraw = async (id) => {
    const res = await dispatch(withdrawApplication(id));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'info', message: 'Application withdrawn.' }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p className="subtitle">Track every application and its current stage.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary btn-sm">Browse jobs</Link>
      </div>

      {loading ? (
        <Loader />
      ) : mine.length === 0 ? (
        <EmptyState icon="📄" title="You have not applied anywhere yet" hint="Browse jobs and submit your first application." />
      ) : (
        <div className="grid grid-2">
          {mine.map((app) => {
            const job = app.job || {};
            return (
              <div className="card" key={app._id}>
                <div className="flex between center">
                  <div>
                    <h3 style={{ marginBottom: 2 }}>{job.title}</h3>
                    <div className="muted small">{job.company?.name} · {job.location}</div>
                  </div>
                  <Badge value={app.status} />
                </div>

                <div className="flex between center mt-2">
                  <span className="ctc">{formatCompensation(job)}</span>
                  <span className="muted small">Applied {formatDate(app.createdAt)}</span>
                </div>

                {app.timeline?.length > 0 && (
                  <ul className="timeline mt-2">
                    {app.timeline.map((t, i) => (
                      <li key={i}>
                        <div className="flex between center">
                          <Badge value={t.status} />
                          <span className="muted small">{formatDate(t.at)}</span>
                        </div>
                        {t.note && <div className="muted small">{t.note}</div>}
                      </li>
                    ))}
                  </ul>
                )}

                {['applied', 'shortlisted', 'interview'].includes(app.status) && (
                  <button className="btn btn-danger btn-sm mt-2" onClick={() => withdraw(app._id)}>
                    Withdraw
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
