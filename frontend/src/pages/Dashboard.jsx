import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import { fetchJobs } from '../features/jobsSlice.js';
import { fetchMyApplications } from '../features/applicationsSlice.js';
import { fetchEvents } from '../features/eventsSlice.js';
import { formatDate } from '../utils/format.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: jobs, loading: jobsLoading } = useSelector((s) => s.jobs);
  const { mine: applications } = useSelector((s) => s.applications);
  const { items: events } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchJobs({ limit: 4 }));
    dispatch(fetchEvents({ upcoming: 'true', limit: 4 }));
    if (user?.role === 'student') dispatch(fetchMyApplications());
  }, [dispatch, user?.role]);

  const applied = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;
  const selected = applications.filter((a) => a.status === 'selected').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Hi, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="subtitle">Here is what is happening in your placement network.</p>
        </div>
        <Badge value={user?.role} />
      </div>

      {user?.role === 'student' && (
        <div className="grid grid-4 mb-0">
          <StatCard value={applied} label="Applications" />
          <StatCard value={shortlisted} label="Shortlisted" />
          <StatCard value={selected} label="Offers" />
          <StatCard value={jobs.length} label="Open roles" />
        </div>
      )}

      {user?.role === 'alumni' && (
        <div className="card">
          <h3>Give back to your college</h3>
          <p className="muted small">
            Post job referrals, mentor juniors, and stay connected with the alumni directory.
          </p>
          <div className="flex gap wrap">
            <Link to="/post-job" className="btn btn-primary btn-sm">Post a referral</Link>
            <Link to="/mentorship" className="btn btn-outline btn-sm">Mentorship requests</Link>
            <Link to="/alumni" className="btn btn-outline btn-sm">Alumni directory</Link>
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="card">
          <h3>Placement office controls</h3>
          <p className="muted small">Manage students, approve alumni, and track placement performance.</p>
          <div className="flex gap wrap">
            <Link to="/admin" className="btn btn-primary btn-sm">Placement dashboard</Link>
            <Link to="/admin/alumni" className="btn btn-outline btn-sm">Alumni approvals</Link>
            <Link to="/post-job" className="btn btn-outline btn-sm">Post a job</Link>
          </div>
        </div>
      )}

      <div className="grid grid-2 mt-3">
        <div>
          <div className="page-header mb-0">
            <h3>Latest opportunities</h3>
            <Link to="/jobs" className="small" style={{ color: 'var(--primary)' }}>View all</Link>
          </div>
          {jobsLoading ? (
            <Loader />
          ) : jobs.length === 0 ? (
            <EmptyState icon="💼" title="No jobs posted yet" />
          ) : (
            jobs.map((job) => (
              <div className="card" key={job._id} style={{ marginBottom: 12 }}>
                <div className="flex between center">
                  <div>
                    <strong>{job.title}</strong>
                    <div className="muted small">{job.company?.name} · {job.location}</div>
                  </div>
                  <Link className="btn btn-outline btn-sm" to={`/jobs/${job._id}`}>View</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="page-header mb-0">
            <h3>Upcoming events</h3>
            <Link to="/events" className="small" style={{ color: 'var(--primary)' }}>View all</Link>
          </div>
          {events.length === 0 ? (
            <EmptyState icon="📅" title="No upcoming events" />
          ) : (
            events.map((ev) => (
              <div className="card" key={ev._id} style={{ marginBottom: 12 }}>
                <div className="flex between center">
                  <div>
                    <strong>{ev.title}</strong>
                    <div className="muted small">{formatDate(ev.date)} · {ev.mode}</div>
                  </div>
                  <Badge value={ev.type} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
