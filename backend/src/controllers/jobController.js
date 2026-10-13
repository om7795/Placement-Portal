import Job from '../models/Job.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';
import { checkEligibility } from '../utils/eligibility.js';

// @desc    List / search jobs
// @route   GET /api/jobs?type=&location=&workMode=&company=&q=&status=&eligible=true
// @access  Private
export const listJobs = asyncHandler(async (req, res) => {
  const { type, location, workMode, company, q, status = 'open', eligible } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (type) filter.type = type;
  if (workMode) filter.workMode = workMode;
  if (status) filter.status = status;
  if (location) filter.location = new RegExp(location, 'i');
  if (company) filter.company = company;
  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { skills: new RegExp(q, 'i') },
    ];
  }

  let items = await Job.find(filter)
    .populate('company', 'name logo industry location')
    .populate('postedBy', 'name role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  let total = await Job.countDocuments(filter);

  // Optionally annotate/filter by the calling student's eligibility
  if (req.user?.role === 'student' && (eligible === 'true' || eligible === 'false')) {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    items = items.map((job) => {
      const { eligible: isEligible, reasons } = checkEligibility(profile, job);
      return { ...job.toObject(), isEligible, ineligibilityReasons: reasons };
    });
    if (eligible === 'true') {
      items = items.filter((j) => j.isEligible);
      total = items.length;
    }
  }

  return paged(res, { items, total, page, limit });
});

// @desc    Get a single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company')
    .populate('postedBy', 'name role');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  let eligibility = null;
  if (req.user?.role === 'student') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    eligibility = checkEligibility(profile, job);
  }

  return ok(res, { job, eligibility });
});

// @desc    Create a job / referral
// @route   POST /api/jobs
// @access  Private (admin, alumni)
export const createJob = asyncHandler(async (req, res) => {
  const { company, ...rest } = req.body;

  // Allow passing a company name string, or an existing company id
  let companyId = company;
  if (company && !/^[a-f\d]{24}$/i.test(String(company))) {
    let existing = await Company.findOne({ name: company });
    if (!existing) existing = await Company.create({ name: company, createdBy: req.user._id });
    companyId = existing._id;
  }
  if (!companyId) {
    res.status(400);
    throw new Error('A company is required');
  }

  const job = await Job.create({
    ...rest,
    company: companyId,
    postedBy: req.user._id,
    postedByRole: req.user.role === 'alumni' ? 'alumni' : 'admin',
    isReferral: req.user.role === 'alumni',
  });

  const populated = await job.populate('company', 'name logo');
  return created(res, populated, 'Job posted');
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (admin, or the alumni who posted it)
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && String(job.postedBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only edit jobs you posted');
  }
  Object.assign(job, req.body);
  await job.save();
  return ok(res, job, 'Job updated');
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (admin, or the alumni who posted it)
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && String(job.postedBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only delete jobs you posted');
  }
  await job.deleteOne();
  return ok(res, null, 'Job deleted');
});

// @desc    Jobs posted by the calling alumni
// @route   GET /api/jobs/mine
// @access  Private (alumni, admin)
export const myPostedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('company', 'name logo')
    .sort({ createdAt: -1 });
  return ok(res, jobs);
});
