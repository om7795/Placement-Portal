/** Small formatting helpers used across the UI. */

export function formatDate(value) {
  if (!value) return '\u2014';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '\u2014';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '\u2014';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '\u2014';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** LPA for full-time, rupees/month for internships. */
export function formatCompensation(job) {
  if (!job) return '\u2014';
  if (job.type === 'internship') {
    return `\u20B9${Number(job.ctc || 0).toLocaleString('en-IN')}/month`;
  }
  return `\u20B9${Number(job.ctc || 0).toLocaleString('en-IN')} LPA`;
}

export function titleCase(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export const STATUS_LABELS = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  selected: 'Selected',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};
