import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/authSlice.js';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: 'CSE',
    batch: new Date().getFullYear() + 3,
    graduationYear: new Date().getFullYear() - 3,
    company: '',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, role };
    if (role === 'student') {
      delete payload.graduationYear;
      delete payload.company;
    } else {
      delete payload.batch;
    }
    const res = await dispatch(register(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate(role === 'student' ? '/dashboard' : '/profile', { replace: true });
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="logo">P</div>
        <h2>Create your account</h2>
        <p className="muted small">Join the placement &amp; alumni network.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="role-toggle">
          <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => { setRole('student'); dispatch(clearError()); }}>
            Student
          </button>
          <button type="button" className={role === 'alumni' ? 'active' : ''} onClick={() => { setRole('alumni'); dispatch(clearError()); }}>
            Alumni
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full name</label>
            <input required value={form.name} onChange={set('name')} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="you@college.edu" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="At least 6 characters" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {role === 'student' ? (
              <div className="form-group">
                <label>Graduation batch</label>
                <input type="number" value={form.batch} onChange={set('batch')} min={2024} max={2035} />
              </div>
            ) : (
              <div className="form-group">
                <label>Graduation year</label>
                <input type="number" value={form.graduationYear} onChange={set('graduationYear')} min={1990} max={2035} />
              </div>
            )}
          </div>

          {role === 'alumni' && (
            <div className="form-group">
              <label>Current company (optional)</label>
              <input value={form.company} onChange={set('company')} placeholder="e.g. Google" />
            </div>
          )}

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account\u2026' : `Register as ${role}`}
          </button>
        </form>

        {role === 'alumni' && (
          <div className="alert alert-info mt-2 small">
            Alumni accounts are reviewed by the placement office before appearing in the directory.
          </div>
        )}

        <p className="small muted mt-2" style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
