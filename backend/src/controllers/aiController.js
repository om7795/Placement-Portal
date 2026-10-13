import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/respond.js';

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Proxy helper to the FastAPI microservice.
 * If the service is down, returns a graceful "unavailable" payload
 * so the frontend never breaks.
 */
async function callAI(path, payload) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${AI_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`AI service responded ${res.status}`);
    return await res.json();
  } catch (err) {
    return { available: false, error: err.message, message: 'AI service is not reachable' };
  }
}

// @desc    AI service health (proxied)
// @route   GET /api/ai/health
// @access  Private
export const aiHealth = asyncHandler(async (req, res) => {
  try {
    const r = await fetch(`${AI_URL}/health`);
    const data = await r.json();
    return ok(res, data);
  } catch (err) {
    return ok(res, { status: 'unavailable', error: err.message });
  }
});

// @desc    Score a resume against a job description
// @route   POST /api/ai/match
// @access  Private (student)
export const matchResume = asyncHandler(async (req, res) => {
  const { resumeText = '', jobDescription = '', skills = [] } = req.body;
  const result = await callAI('/match/resume', { resumeText, jobDescription, skills });
  return ok(res, result);
});

// @desc    Recommend jobs for the calling student
// @route   POST /api/ai/recommend
// @access  Private (student)
export const recommendJobs = asyncHandler(async (req, res) => {
  const { skills = [], department = '', interests = [] } = req.body;
  const result = await callAI('/recommend/jobs', { skills, department, interests });
  return ok(res, result);
});
