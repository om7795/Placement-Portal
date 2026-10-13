import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FEATURES = [
  { icon: '\u{1F50D}', title: 'Discover opportunities', text: 'Browse verified jobs and internships from top recruiters and alumni referrals.' },
  { icon: '\u{1F4C4}', title: 'Apply in one click', text: 'Eligibility-aware applications with a live status tracker for every role.' },
  { icon: '\u{1F91D}', title: 'Find a mentor', text: 'Connect with alumni for referrals, guidance, and interview preparation.' },
  { icon: '\u{1F4CA}', title: 'Placement analytics', text: 'TPO dashboards for offers, top recruiters, and department-wise placement.' },
];

export default function Home() {
  const { token } = useSelector((s) => s.auth);

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">P</span>
          <span>Placement Portal</span>
        </Link>
        <div className="spacer" />
        {token ? (
          <Link to="/dashboard" className="btn btn-primary btn-sm">Go to dashboard</Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </>
        )}
      </header>

      <main className="page">
        <section className="hero">
          <h1>Where students, alumni, and the placement cell connect.</h1>
          <p>One portal for campus placements, alumni mentorship, referrals, and placement analytics, built for your college.</p>
          <div className="actions">
            <Link to={token ? '/jobs' : '/register'} className="btn btn-outline">
              Explore jobs
            </Link>
            <Link to={token ? '/alumni' : '/register'} className="btn btn-outline">
              Alumni network
            </Link>
          </div>
        </section>

        <section className="grid grid-4">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted small mb-0">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
