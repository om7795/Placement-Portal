import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import { fetchStats } from '../features/adminSlice.js';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading || !stats) return <div className="page"><Loader /></div>;

  const { totals, ctc, topRecruiters, byDepartment, byStatus } = stats;
  const maxDept = Math.max(...byDepartment.map((d) => d.total), 1);
  const totalStatus = byStatus.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Placement Dashboard</h1>
          <p className="subtitle">Live placement analytics for the Training &amp; Placement Office.</p>
        </div>
      </div>

      <div className="grid grid-4">
        <StatCard value={totals.totalStudents} label="Students" />
        <StatCard value={totals.placedStudents} label="Placed" hint={`${totals.placementRate}% placement rate`} />
        <StatCard value={totals.totalCompanies} label="Companies" />
        <StatCard value={totals.openJobs} label="Open roles" />
        <StatCard value={totals.totalApplications} label="Applications" />
        <StatCard value={totals.selected} label="Offers rolled out" />
        <StatCard value={totals.totalAlumni} label="Verified alumni" hint={`${totals.pendingAlumni} pending approval`} />
        <StatCard value={totals.upcomingEvents} label="Upcoming events" />
      </div>

      <div className="grid grid-2 mt-3">
        <div className="card">
          <h3>Compensation</h3>
          <div className="grid grid-3">
            <div>
              <div className="value ctc" style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{ctc.highestCTC} LPA</div>
              <div className="muted small">Highest CTC</div>
            </div>
            <div>
              <div className="ctc" style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{ctc.averageCTC} LPA</div>
              <div className="muted small">Average CTC</div>
            </div>
            <div>
              <div className="ctc" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{ctc.offers}</div>
              <div className="muted small">Full-time offers</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Top recruiters</h3>
          {topRecruiters.length === 0 ? (
            <p className="muted small">No offers recorded yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Offers</th></tr></thead>
                <tbody>
                  {topRecruiters.map((r) => (
                    <tr key={r._id}><td>{r._id}</td><td>{r.offers}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-2 mt-3">
        <div className="card">
          <h3>Placement by department</h3>
          {byDepartment.map((d) => (
            <div key={d._id} style={{ marginBottom: 12 }}>
              <div className="flex between small">
                <span>{d._id}</span>
                <span className="muted">{d.placed}/{d.total} placed</span>
              </div>
              <div style={{ background: '#eef2ff', borderRadius: 999, height: 10, marginTop: 4 }}>
                <div
                  style={{
                    width: `${(d.total / maxDept) * 100}%`,
                    background: 'var(--primary)',
                    height: '100%',
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Application funnel</h3>
          {byStatus.length === 0 ? (
            <p className="muted small">No applications yet.</p>
          ) : (
            byStatus.map((s) => (
              <div key={s._id} style={{ marginBottom: 12 }}>
                <div className="flex between small">
                  <span style={{ textTransform: 'capitalize' }}>{s._id}</span>
                  <span className="muted">{s.count}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: 999, height: 10, marginTop: 4 }}>
                  <div
                    style={{
                      width: `${(s.count / totalStatus) * 100}%`,
                      background: 'var(--accent)',
                      height: '100%',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
