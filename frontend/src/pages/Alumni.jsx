import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { fetchAlumni, fetchMentors } from '../features/alumniSlice.js';
import { initials } from '../utils/format.js';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'];

export default function Alumni() {
  const dispatch = useDispatch();
  const { list, mentors, loading, meta } = useSelector((s) => s.alumni);
  const [tab, setTab] = useState('directory');
  const [filters, setFilters] = useState({ q: '', company: '', department: '', graduationYear: '' });

  useEffect(() => {
    dispatch(fetchAlumni({ limit: 30 }));
    dispatch(fetchMentors());
  }, [dispatch]);

  const applyFilters = () => {
    const params = { limit: 30 };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchAlumni(params));
  };

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Alumni Network</h1>
          <p className="subtitle">{meta.total} alumni · {mentors.length} available as mentors</p>
        </div>
      </div>

      <div className="flex gap wrap" style={{ marginBottom: 16 }}>
        <button className={`btn ${tab === 'directory' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setTab('directory')}>
          Directory
        </button>
        <button className={`btn ${tab === 'mentors' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setTab('mentors')}>
          Mentors
        </button>
      </div>

      {tab === 'directory' && (
        <div className="card mb-0">
          <div className="form-row">
            <div className="form-group mb-0">
              <label>Search</label>
              <input placeholder="Name" value={filters.q} onChange={set('q')} />
            </div>
            <div className="form-group mb-0">
              <label>Company</label>
              <input placeholder="e.g. Google" value={filters.company} onChange={set('company')} />
            </div>
            <div className="form-group mb-0">
              <label>Department</label>
              <select value={filters.department} onChange={set('department')}>
                <option value="">All</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group mb-0">
              <label>Grad year</label>
              <input type="number" placeholder="e.g. 2021" value={filters.graduationYear} onChange={set('graduationYear')} />
            </div>
            <div className="form-group mb-0" style={{ alignSelf: 'end' }}>
              <button className="btn btn-primary btn-sm" onClick={applyFilters}>Apply filters</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        {loading ? (
          <Loader />
        ) : tab === 'mentors' ? (
          mentors.length === 0 ? (
            <EmptyState icon="🤝" title="No mentors available right now" />
          ) : (
            <div className="grid grid-3">
              {mentors.map((m) => (
                <div className="card" key={m._id}>
                  <div className="flex center gap">
                    <span className="avatar avatar-lg">{initials(m.user?.name)}</span>
                    <div>
                      <h3 style={{ marginBottom: 2 }}>{m.user?.name}</h3>
                      <div className="muted small">{m.designation} · {m.company}</div>
                    </div>
                  </div>
                  {m.mentoringDomains?.length > 0 && (
                    <div className="chips mt-2">
                      {m.mentoringDomains.map((d) => <span className="chip" key={d}>{d}</span>)}
                    </div>
                  )}
                  <div className="muted small mt-2">{m.experienceYears} yrs experience</div>
                </div>
              ))}
            </div>
          )
        ) : list.length === 0 ? (
          <EmptyState icon="🎓" title="No alumni match your filters" />
        ) : (
          <div className="grid grid-3">
            {list.map((a) => (
              <div className="card" key={a._id}>
                <div className="flex between center">
                  <span className="avatar">{initials(a.user?.name)}</span>
                  {a.isMentor && <Badge value="success" label="Mentor" />}
                </div>
                <h3 className="mt-2" style={{ marginBottom: 2 }}>{a.user?.name}</h3>
                <div className="muted small">{a.designation || 'Alumnus'} {a.company && `· ${a.company}`}</div>
                <div className="muted small">{a.department} · Class of {a.graduationYear}</div>
                {a.location && <div className="muted small">📍 {a.location}</div>}
                {a.skills?.length > 0 && (
                  <div className="chips mt-2">
                    {a.skills.slice(0, 4).map((s) => <span className="chip" key={s}>{s}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
