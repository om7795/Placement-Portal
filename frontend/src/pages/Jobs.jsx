import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from '../components/JobCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { fetchJobs } from '../features/jobsSlice.js';

export default function Jobs() {
  const dispatch = useDispatch();
  const { items, loading, meta } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);
  const [filters, setFilters] = useState({ q: '', type: '', workMode: '', location: '', eligible: '' });

  useEffect(() => {
    const params = { page: 1, limit: 24 };
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    dispatch(fetchJobs(params));
  }, [dispatch, filters]);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Jobs &amp; Internships</h1>
          <p className="subtitle">{meta.total} opening{meta.total === 1 ? '' : 's'} available</p>
        </div>
      </div>

      <div className="card mb-0">
        <div className="form-row">
          <div className="form-group mb-0">
            <label>Search</label>
            <input placeholder="Title, skill or keyword" value={filters.q} onChange={set('q')} />
          </div>
          <div className="form-group mb-0">
            <label>Type</label>
            <select value={filters.type} onChange={set('type')}>
              <option value="">All types</option>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label>Work mode</label>
            <select value={filters.workMode} onChange={set('workMode')}>
              <option value="">Any</option>
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group mb-0">
            <label>Location</label>
            <input placeholder="e.g. Bengaluru" value={filters.location} onChange={set('location')} />
          </div>
          {user?.role === 'student' && (
            <div className="form-group mb-0">
              <label>Eligibility</label>
              <select value={filters.eligible} onChange={set('eligible')}>
                <option value="">All jobs</option>
                <option value="true">I am eligible</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState icon="🔍" title="No jobs match your filters" hint="Try clearing the search or filters." />
        ) : (
          <div className="grid grid-3">
            {items.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                footer={
                  job.isEligible === false ? (
                    <span className="badge badge-warning" title={(job.ineligibilityReasons || []).join('; ')}>
                      Not eligible
                    </span>
                  ) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
