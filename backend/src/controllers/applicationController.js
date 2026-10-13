import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';
import { checkEligibility } from '../utils/eligibility.js';
import { notify } from '../utils/notify.js';

// @desc    Apply to a job (student)
// @route   POST /api/applications
// @access  Private (student)
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter = '', resumeUrl } = req.body;

  const job = await Job.findById(jobId).populate('company', 'name');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.status !== 'open') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }
  if (job.deadline && new Date(job.deadline) < new Date()) {
    res.status(400);
    throw new Error('The application deadline has passed');
  }

  const profile = await StudentProfile.findOne({ user: req.user._id });
  const { eligible, reasons } = checkEligibility(profile, job);
  if (!eligible) {
    res.status(400);
    throw new Error(`You are not eligible: ${reasons.join('; ')}`);
  }

  const existing = await Application.findOne({ student: req.user._id, job: job._id });
  if (existing) {
    res.status(409);
    throw new Error('You have already applied to this job');
  }

  const application = await Application.create({
    student: req.user._id,
    job: job._id,
    coverLetter,
    resumeUrl: resumeUrl || profile?.resumeUrl || '',
    timeline: [{ status: 'applied', note: 'Application submitted', by: req.user._id }],
  });

  await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });

  await notify({
    user: req.user._id,
    title: `Applied to ${job.title}`,
    message: `Your application to ${job.company?.name || 'the company'} was submitted.`,
    type: 'application',
    link: '/applications',
  });

  return created(res, application, 'Application submitted');
});

// @desc    My applications (student)
// @route   GET /api/applications/mine
// @access  Private (student)
export const myApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })
    .sort({ createdAt: -1 });
  return ok(res, applications);
});

// @desc    Applications for a job (admin, or the alumni who posted it)
// @route   GET /api/applications/job/:jobId
// @access  Private (admin, alumni)
export const jobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && String(job.postedBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only view applications for jobs you posted');
  }

  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20 });
  const filter = { job: job._id };

  const [items, total] = await Promise.all([
    Application.find(filter)
      .populate('student', 'name email avatar phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);
  return paged(res, { items, total, page, limit });
});

// @desc    Update an application's status
// @route   PATCH /api/applications/:id/status
// @access  Private (admin, or the alumni who posted the job)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note = '' } = req.body;
  const application = await Application.findById(req.params.id).populate('job', 'title postedBy');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (
    req.user.role !== 'admin' &&
    String(application.job?.postedBy) !== String(req.user._id)
  ) {
    res.status(403);
    throw new Error('You cannot update this application');
  }

  application.status = status;
  application.timeline.push({ status, note, by: req.user._id });
  await application.save();

  await notify({
    user: application.student,
    title: `Application update: ${status}`,
    message: `Your application for ${application.job?.title || 'a role'} is now "${status}".`,
    type: 'application',
    link: '/applications',
  });

  return ok(res, application, 'Application status updated');
});

// @desc    Withdraw my application (student)
// @route   PATCH /api/applications/:id/withdraw
// @access  Private (student)
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (String(application.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only withdraw your own application');
  }
  application.status = 'withdrawn';
  application.timeline.push({ status: 'withdrawn', note: 'Withdrawn by student', by: req.user._id });
  await application.save();
  return ok(res, application, 'Application withdrawn');
});
