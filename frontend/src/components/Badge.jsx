import { STATUS_LABELS } from '../utils/format.js';

const VARIANTS = {
  applied: 'badge-info',
  shortlisted: 'badge-primary',
  interview: 'badge-warning',
  selected: 'badge-success',
  rejected: 'badge-danger',
  withdrawn: 'badge-neutral',
  open: 'badge-success',
  closed: 'badge-neutral',
  fulltime: 'badge-primary',
  internship: 'badge-info',
  pending: 'badge-warning',
  accepted: 'badge-success',
  declined: 'badge-danger',
  completed: 'badge-neutral',
  admin: 'badge-primary',
  alumni: 'badge-info',
  student: 'badge-neutral',
};

export default function Badge({ value, label }) {
  const key = String(value || '').toLowerCase();
  const variant = VARIANTS[key] || 'badge-neutral';
  return <span className={`badge ${variant}`}>{label || STATUS_LABELS[key] || value}</span>;
}
