import AlumniProfile from '../models/AlumniProfile.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';
import { notify } from '../utils/notify.js';

// @desc    Get my alumni profile
// @route   GET /api/alumni/me
// @access  Private (alumni)
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await AlumniProfile.findOne({ user: req.user._id });
  return ok(res, profile);
});

// @desc    Create or update my alumni profile
// @route   PUT /api/alumni/me
// @access  Private (alumni)
export const upsertMyProfile = asyncHandler(async (req, res) => {
  const allowed = [
    'graduationYear',
    'department',
    'company',
    'designation',
    'location',
    'experienceYears',
    'skills',
    'bio',
    'linkedin',
    'isMentor',
    'mentoringDomains',
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const profile = await AlumniProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return ok(res, profile, 'Profile saved');
});

// @desc    Alumni directory (approved + active only), with filters
// @route   GET /api/alumni?q=&company=&department=&graduationYear=&mentor=true
// @access  Private
export const listAlumni = asyncHandler(async (req, res) => {
  const { q, company, department, graduationYear, mentor } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (company) filter.company = new RegExp(company, 'i');
  if (department) filter.department = department;
  if (graduationYear) filter.graduationYear = Number(graduationYear);
  if (mentor === 'true') filter.isMentor = true;

  // Only approved alumni are visible in the directory
  const approvedUsers = await User.find({ role: 'alumni', isApproved: true, isActive: true }).select('_id');
  filter.user = { $in: approvedUsers.map((u) => u._id) };

  if (q) {
    const matched = await User.find({
      _id: { $in: filter.user.$in },
      $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
    }).select('_id');
    filter.user = { $in: matched.map((u) => u._id) };
  }

  const [items, total] = await Promise.all([
    AlumniProfile.find(filter)
      .populate('user', 'name email avatar')
      .sort({ graduationYear: -1 })
      .skip(skip)
      .limit(limit),
    AlumniProfile.countDocuments(filter),
  ]);

  return paged(res, { items, total, page, limit });
});

// @desc    List alumni who offer mentoring
// @route   GET /api/alumni/mentors
// @access  Private
export const listMentors = asyncHandler(async (req, res) => {
  const approvedUsers = await User.find({ role: 'alumni', isApproved: true, isActive: true }).select('_id');
  const mentors = await AlumniProfile.find({
    user: { $in: approvedUsers.map((u) => u._id) },
    isMentor: true,
  })
    .populate('user', 'name email avatar')
    .sort({ experienceYears: -1 });
  return ok(res, mentors);
});

// @desc    Approve a pending alumni registration
// @route   PATCH /api/alumni/:userId/approve
// @access  Private (admin)
export const approveAlumni = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role !== 'alumni') {
    res.status(404);
    throw new Error('Alumni user not found');
  }
  user.isApproved = true;
  await user.save({ validateBeforeSave: false });

  await notify({
    user: user._id,
    title: 'Alumni account approved',
    message: 'Your alumni account has been verified. You can now post referrals and mentor students.',
    type: 'system',
    link: '/alumni',
  });

  return ok(res, user.toSafeJSON(), 'Alumni approved');
});

// @desc    List pending alumni awaiting approval
// @route   GET /api/alumni/pending
// @access  Private (admin)
export const listPending = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'alumni', isApproved: false }).select('name email createdAt');
  return ok(res, users);
});
