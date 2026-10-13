import { useEffect, useState } from 'react';
import { studentApi } from '../api/index.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import { initials } from '../utils/format.js';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'];

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', department: '', batch: '', placed: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const r = await studentApi.list(params);
      setStudents(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p className="subtitle">{students.length} student profile(s)</p>
        </div>
      </div>

      <div className="card mb-0">
        <div className="form-row">
          <div className="form-group mb-0">
            <label>Search</label>
            <input placeholder="Name or email" value={filters.q} onChange={set('q')} />
          </div>
          <div className="form-group mb-0">
            <label>Department</label>
            <select value={filters.department} onChange={set('department')}>
              <option value="">All</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <label>Batch</label>
            <input type="number" placeholder="e.g. 2027" value={filters.batch} onChange={set('batch')} />
          </div>
          <div className="form-group mb-0">
            <label>Placed</label>
            <select value={filters.placed} onChange={set('placed')}>
              <option value="">Any</option>
              <option value="true">Placed</option>
              <option value="false">Not placed</option>
            </select>
          </div>
          <div className="form-group mb-0" style={{ alignSelf: 'end' }}>
            <button className="btn btn-primary btn-sm" onClick={load}>Apply</button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <Loader />
        ) : students.length === 0 ? (
          <EmptyState icon="🧑‍🎓" title="No students match your filters" />
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Dept</th>
                  <th>Batch</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex center gap">
                        <span className="avatar">{initials(s.user?.name)}</span>
                        <div>
                          <div>{s.user?.name}</div>
                          <div className="muted small">{s.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.department}</td>
                    <td>{s.batch}</td>
                    <td>{s.cgpa}</td>
                    <td>{s.backlogs}</td>
                    <td>
                      {s.placedAt ? <Badge value="selected" label="Placed" /> : <Badge value="neutral" label="In progress" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
