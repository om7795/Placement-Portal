import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
import { formatCompensation, formatDate } from '../utils/format.js';

export default function JobCard({ job, footer }) {
  const company = job.company || {};
  return (
    <article className="card job-card">
      <div className="top">
        <div>
          <div className="company">{company.name || 'Company'}</div>
          <h3>
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
        </div>
        <Badge value={job.type} />
      </div>

      <div className="job-meta">
        <span>{'\u{1F4CD}'} {job.location || 'Location N/A'}</span>
        <span>{'\u{1F3E0}'} {job.workMode}</span>
        {job.deadline && <span>{'\u23F3'} Apply by {formatDate(job.deadline)}</span>}
      </div>

      {job.skills?.length > 0 && (
        <div className="chips">
          {job.skills.slice(0, 5).map((s) => (
            <span className="chip" key={s}>{s}</span>
          ))}
        </div>
      )}

      {job.isReferral && <Badge value="info" label="Alumni referral" />}

      <div className="footer">
        <span className="ctc">{formatCompensation(job)}</span>
        {footer ?? (
          <Link className="btn btn-outline btn-sm" to={`/jobs/${job._id}`}>
            View details
          </Link>
        )}
      </div>
    </article>
  );
}
