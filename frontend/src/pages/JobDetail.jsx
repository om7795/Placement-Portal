import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import Badge from '../components/Badge.jsx';
import { fetchJob, clearCurrent } from '../features/jobsSlice.js';
import { applyToJob } from '../features/applicationsSlice.js';
import { showToast } from '../features/uiSlice.js';
import { formatCompensation, formatDate } from '../utils/format.js';

export default function JobDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: job, currentEligibility: eligibility, loading } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchJob(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const apply = async () => {
    setApplying(true);
    const res = await dispatch(applyToJob({ jobId: id, coverLetter }));
    setApplying(false);
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Application submitted successfully.' }));
      navigate('/applications');
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Could not apply' }));
    }
  };

  if (loading || !job) return <div className="page"><Loader /></div>;

  const company = job.company || {};
  const e = job.eligibility || {};

  return (
    <div className="page">
      <Link to="/jobs" className="small muted">&larr; Back to jobs</Link>

      <div className="page-header mt-2">
        <div>
          <h1>{job.title}</h1>
          <p className="subtitle">{company.name} · {job.location || 'Location N/A'}</p>
          <div className="chips mt-1">
            <Badge value={job.type} />
            <Badge value={job.workMode} label={job.workMode} />
            {job.isReferral && <Badge value="info" label="Alumni referral" />}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="ctc" style={{ fontSize: '1.3rem' }}>{formatCompensation(job)}</div>
          <div className="muted small">{job.openings} opening{job.openings === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card">
            <h3>About the role</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

            {job.responsibilities?.length > 0 && (
              <>
                <h4 className="mt-2">Responsibilities</h4>
                <ul className="muted">
                  {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </>
            )}

            {job.skills?.length > 0 && (
              <>
                <h4 className="mt-2">Skills</h4>
                <div className="chips">
                  {job.skills.map((s) => <span className="chip" key={s}>{s}</span>)}
                </div>
              </>
            )}
          </div>

          <div className="card">
            <h3>Eligibility</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  <tr><td className="muted">Minimum CGPA</td><td>{e.minCGPA || 'Any'}</td></tr>
                  <tr><td className="muted">Max backlogs</td><td>{e.maxBacklogs ?? 'Any'}</td></tr>
                  <tr><td className="muted">Departments</td><td>{e.departments?.length ? e.departments.join(', ') : 'All'}</td></tr>
                  <tr><td className="muted">Batches</td><td>{e.batches?.length ? e.batches.join(', ') : 'All'}</td></tr>
                  <tr><td className="muted">Deadline</td><td>{formatDate(job.deadline)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          {user?.role === 'student' ? (
            <div className="card">
              <h3>Apply for this role</h3>
              {eligibility && !eligibility.eligible ? (
                <div className="alert alert-error">
                  You are not eligible for this role:
                  <ul style={{ margin: '6px 0 0 18px' }}>
                    {eligibility.reasons.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Cover letter (optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a good fit?"
                    />
                  </div>
                  <button className="btn btn-primary btn-block" onClick={apply} disabled={applying || job.status !== 'open'}>
                    {job.status !== 'open' ? 'Applications closed' : applying ? 'Submitting…' : 'Submit application'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="card">
              <h3>Recruiter view</h3>
              <p className="muted small">{job.applicantsCount} candidate(s) have applied.</p>
              {(user?.role === 'admin' || String(job.postedBy?._id) === String(user?._id)) && (
                <Link className="btn btn-primary btn-sm" to={`/jobs/${job._id}/applicants`}>
                  View applicants
                </Link>
              )}
            </div>
          )}

          <div className="card">
            <h3>About {company.name || 'the company'}</h3>
            <p className="muted small">{company.description || 'No description available.'}</p>
            {company.industry && <div className="small muted">Industry: {company.industry}</div>}
            {company.location && <div className="small muted">HQ: {company.location}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
