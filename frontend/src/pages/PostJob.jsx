import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { createJob, fetchMyJobs } from '../features/jobsSlice.js';
import { showToast } from '../features/uiSlice.js';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'];

const initial = {
  title: '',
  company: '',
  type: 'fulltime',
  description: '',
  location: '',
  workMode: 'onsite',
  ctc: '',
  skills: '',
  openings: 1,
  minCGPA: 0,
  maxBacklogs: 0,
  departments: [],
  batches: '',
  deadline: '',
};

export default function PostJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { myJobs } = useSelector((s) => s.jobs);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleDept = (d) => {
    setForm((f) => ({
      ...f,
      departments: f.departments.includes(d)
        ? f.departments.filter((x) => x !== d)
        : [...f.departments, d],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      company: form.company,
      type: form.type,
      description: form.description,
      location: form.location,
      workMode: form.workMode,
      ctc: Number(form.ctc) || 0,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      openings: Number(form.openings) || 1,
      eligibility: {
        minCGPA: Number(form.minCGPA) || 0,
        maxBacklogs: Number(form.maxBacklogs) || 0,
        departments: form.departments,
        batches: form.batches.split(',').map((b) => Number(b.trim())).filter(Boolean),
      },
      deadline: form.deadline || undefined,
    };
    const res = await dispatch(createJob(payload));
    setSaving(false);
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Job posted successfully.' }));
      setForm(initial);
      navigate('/jobs');
    } else {
      dispatch(showToast({ type: 'error', message: res.payload || 'Could not post job' }));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{user?.role === 'alumni' ? 'Post a referral' : 'Post a job'}</h1>
          <p className="subtitle">
            {user?.role === 'alumni'
              ? 'Refer juniors to openings at your company.'
              : 'Publish an opening to all eligible students.'}
          </p>
        </div>
      </div>

      <form className="card" onSubmit={submit}>
        <div className="form-row">
          <div className="form-group">
            <label>Job title</label>
            <input required value={form.title} onChange={set('title')} placeholder="e.g. Software Engineer" />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input required value={form.company} onChange={set('company')} placeholder="e.g. Google" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Work mode</label>
            <select value={form.workMode} onChange={set('workMode')}>
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="form-group">
            <label>{form.type === 'internship' ? 'Stipend (₹/month)' : 'CTC (LPA)'}</label>
            <input type="number" min="0" value={form.ctc} onChange={set('ctc')} placeholder="e.g. 12" />
          </div>
          <div className="form-group">
            <label>Openings</label>
            <input type="number" min="1" value={form.openings} onChange={set('openings')} />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea required value={form.description} onChange={set('description')} placeholder="Role overview, responsibilities, etc." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={set('location')} placeholder="e.g. Bengaluru" />
          </div>
          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input value={form.skills} onChange={set('skills')} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="form-group">
            <label>Application deadline</label>
            <input type="date" value={form.deadline} onChange={set('deadline')} />
          </div>
        </div>

        <h4 className="mt-2">Eligibility criteria</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Minimum CGPA</label>
            <input type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={set('minCGPA')} />
          </div>
          <div className="form-group">
            <label>Max backlogs</label>
            <input type="number" min="0" value={form.maxBacklogs} onChange={set('maxBacklogs')} />
          </div>
          <div className="form-group">
            <label>Batches (comma-separated, blank = all)</label>
            <input value={form.batches} onChange={set('batches')} placeholder="2027, 2028" />
          </div>
        </div>

        <div className="form-group">
          <label>Departments (blank = all)</label>
          <div className="chips">
            {DEPARTMENTS.map((d) => (
              <button
                type="button"
                key={d}
                className={`chip`}
                onClick={() => toggleDept(d)}
                style={
                  form.departments.includes(d)
                    ? { background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }
                    : { border: '1px solid var(--border)', cursor: 'pointer' }
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Posting…' : 'Publish opening'}
        </button>
      </form>

      <h3 className="mt-3">Openings you posted</h3>
      {myJobs.length === 0 ? (
        <EmptyState icon="📌" title="You have not posted any openings yet" />
      ) : (
        <div className="grid grid-3">
          {myJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
