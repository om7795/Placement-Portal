import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { fetchJobApplications, updateApplicationStatus } from '../features/applicationsSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatDate, initials } from '../utils/format.js';

const STATUSES = ['applied', 'shortlisted', 'interview', 'selected', 'rejected'];

export default function JobApplicants() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { forJob, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchJobApplications(id));
  }, [dispatch, id]);

  const changeStatus = async (applicationId, status) => {
    const res = await dispatch(updateApplicationStatus({ id: applicationId, status, note: `Marked ${status}` }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: `Application marked ${status}.` }));
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Update failed' }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>
          <p className="subtitle">{forJob.length} candidate(s) applied to this role</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : forJob.length === 0 ? (
        <EmptyState icon="🧑‍🎓" title="No applications yet" />
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {forJob.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div className="flex center gap">
                      <span className="avatar">{initials(a.student?.name)}</span>
                      <div>
                        <div>{a.student?.name}</div>
                        <div className="muted small">{a.student?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted small">{formatDate(a.createdAt)}</td>
                  <td><Badge value={a.status} /></td>
                  <td>
                    {a.resumeUrl ? (
                      <a href={a.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                        View
                      </a>
                    ) : (
                      <span className="muted small">—</span>
                    )}
                  </td>
                  <td>
                    <select value={a.status} onChange={(e) => changeStatus(a._id, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
