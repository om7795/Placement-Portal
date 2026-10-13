import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { studentApi, alumniApi, aiApi } from '../api/index.js';
import { showToast } from '../features/uiSlice.js';
import { initials } from '../utils/format.js';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'];

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((s) => s.auth);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === 'student') {
          const r = await studentApi.getMyProfile();
          setForm(
            r.data || { batch: new Date().getFullYear() + 3, department: 'CSE', skills: [], cgpa: 0, backlogs: 0 }
          );
        } else if (user?.role === 'alumni') {
          const r = await alumniApi.getMyProfile();
          setForm(
            r.data || { graduationYear: new Date().getFullYear() - 3, department: 'CSE', skills: [], isMentor: false }
          );
        } else {
          setForm({});
        }
      } catch (err) {
        dispatch(showToast({ type: 'error', message: err.message }));
      }
    };
    if (user) load();
  }, [user, dispatch]);

  if (!form) return <div className="page">Loading…</div>;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (user.role === 'student') await studentApi.saveMyProfile(payload);
      else if (user.role === 'alumni') await alumniApi.saveMyProfile(payload);
      dispatch(showToast({ type: 'success', message: 'Profile saved.' }));
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  const getRecommendations = async () => {
    setAiLoading(true);
    try {
      const skills = Array.isArray(form.skills) ? form.skills : String(form.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
      const r = await aiApi.recommend({ skills, department: form.department });
      setAiResult(r.data);
    } catch (err) {
      setAiResult({ available: false, message: err.message });
    } finally {
      setAiLoading(false);
    }
  };

  const skillsValue = Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || '';

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex center gap">
          <span className="avatar avatar-lg">{initials(user?.name)}</span>
          <div>
            <h1 style={{ marginBottom: 2 }}>{user?.name}</h1>
            <p className="subtitle">{user?.email} · {user?.role}</p>
          </div>
        </div>
      </div>

      <form className="card" onSubmit={save}>
        <h3>{user?.role === 'student' ? 'Student profile' : user?.role === 'alumni' ? 'Alumni profile' : 'Account'}</h3>

        {user?.role === 'student' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Roll number</label>
                <input value={form.rollNo || ''} onChange={set('rollNo')} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department || 'CSE'} onChange={set('department')}>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Batch (grad year)</label>
                <input type="number" value={form.batch || ''} onChange={set('batch')} />
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input type="number" step="0.1" min="0" max="10" value={form.cgpa ?? ''} onChange={set('cgpa')} />
              </div>
              <div className="form-group">
                <label>Backlogs</label>
                <input type="number" min="0" value={form.backlogs ?? 0} onChange={set('backlogs')} />
              </div>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input value={skillsValue} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Resume URL</label>
                <input value={form.resumeUrl || ''} onChange={set('resumeUrl')} placeholder="https://…" />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input value={form.github || ''} onChange={set('github')} />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input value={form.linkedin || ''} onChange={set('linkedin')} />
              </div>
            </div>
            <div className="form-group">
              <label>About</label>
              <textarea value={form.about || ''} onChange={set('about')} />
            </div>
          </>
        )}

        {user?.role === 'alumni' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Graduation year</label>
                <input type="number" value={form.graduationYear || ''} onChange={set('graduationYear')} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={form.department || 'CSE'} onChange={set('department')}>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Company</label>
                <input value={form.company || ''} onChange={set('company')} />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input value={form.designation || ''} onChange={set('designation')} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location || ''} onChange={set('location')} />
              </div>
              <div className="form-group">
                <label>Experience (years)</label>
                <input type="number" min="0" value={form.experienceYears ?? 0} onChange={set('experienceYears')} />
              </div>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input value={skillsValue} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea value={form.bio || ''} onChange={set('bio')} />
            </div>
            <div className="form-group">
              <label className="flex center gap">
                <input
                  type="checkbox"
                  style={{ width: 'auto' }}
                  checked={!!form.isMentor}
                  onChange={(e) => setForm({ ...form, isMentor: e.target.checked })}
                />
                Available as a mentor
              </label>
            </div>
            <div className="form-group">
              <label>Mentoring domains (comma-separated)</label>
              <input
                value={Array.isArray(form.mentoringDomains) ? form.mentoringDomains.join(', ') : form.mentoringDomains || ''}
                onChange={(e) => setForm({ ...form, mentoringDomains: e.target.value })}
                placeholder="System Design, Interview Prep"
              />
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <p className="muted small">Admin accounts manage the portal from the placement dashboard.</p>
        )}

        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      {user?.role === 'student' && (
        <div className="card">
          <h3>AI career assistant</h3>
          <p className="muted small">Get skill recommendations based on your profile (via the FastAPI service).</p>
          <button className="btn btn-outline btn-sm" onClick={getRecommendations} disabled={aiLoading}>
            {aiLoading ? 'Thinking…' : 'Get recommendations'}
          </button>

          {aiResult && (
            <div className="mt-2">
              {aiResult.available === false ? (
                <div className="alert alert-info mb-0">
                  AI service is not running. Start it with <code>uvicorn main:app --port 8000</code> in the ai-service folder.
                </div>
              ) : (
                <>
                  {aiResult.recommendedSkills?.length > 0 && (
                    <div className="chips">
                      {aiResult.recommendedSkills.map((s) => <span className="chip" key={s}>{s}</span>)}
                    </div>
                  )}
                  <ul className="muted small mt-2">
                    {aiResult.suggestions?.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
