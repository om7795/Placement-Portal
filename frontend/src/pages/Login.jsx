import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/authSlice.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const from = location.state?.from || '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') navigate(from, { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="logo">P</div>
        <h2>Welcome back</h2>
        <p className="muted small">Sign in to the Placement &amp; Alumni Portal.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} onChange={() => error && dispatch(clearError())}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in\u2026' : 'Sign in'}
          </button>
        </form>

        <p className="small muted mt-2" style={{ textAlign: 'center' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)' }}>Create an account</Link>
        </p>

        <div className="alert alert-info mt-2 small">
          Demo login &mdash; student@college.edu / student123 &nbsp;|&nbsp; admin@college.edu / admin123
        </div>
      </div>
    </div>
  );
}
