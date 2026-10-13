/**
 * Check whether a student profile meets a job's eligibility criteria.
 * Returns { eligible: boolean, reasons: string[] }.
 */
export function checkEligibility(profile, job) {
  const reasons = [];
  const e = job.eligibility || {};

  if (!profile) {
    return { eligible: false, reasons: ['No student profile found'] };
  }

  if (e.minCGPA && profile.cgpa < e.minCGPA) {
    reasons.push(`Minimum CGPA ${e.minCGPA} required (you have ${profile.cgpa})`);
  }
  if (e.maxBacklogs !== undefined && e.maxBacklogs !== null && profile.backlogs > e.maxBacklogs) {
    reasons.push(`At most ${e.maxBacklogs} backlog(s) allowed (you have ${profile.backlogs})`);
  }
  if (Array.isArray(e.departments) && e.departments.length && !e.departments.includes(profile.department)) {
    reasons.push(`Open to departments: ${e.departments.join(', ')}`);
  }
  if (Array.isArray(e.batches) && e.batches.length && !e.batches.includes(profile.batch)) {
    reasons.push(`Open to batches: ${e.batches.join(', ')}`);
  }

  return { eligible: reasons.length === 0, reasons };
}

export default checkEligibility;
