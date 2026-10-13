import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';

// @desc    Get my student profile
// @route   GET /api/students/me
// @access  Private (student)
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
    'placedAt',
    'title ctc company'
  );
  return ok(res, profile);
});

// @desc    Create or update my student profile
// @route   PUT /api/students/me
// @access  Private (student)
export const upsertMyProfile = asyncHandler(async (req, res) => {
  const allowed = [
    'rollNo',
    'department',
    'degree',
    'batch',
    'cgpa',
    'backlogs',
    'skills',
    'about',
    'resumeUrl',
    'github',
    'linkedin',
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return ok(res, profile, 'Profile saved');
});

// @desc    List students (admin/TPO, with filters)
// @route   GET /api/students?department=&batch=&minCGPA=&placed=&q=
// @access  Private (admin)
export const listStudents = asyncHandler(async (req, res) => {
  const { department, batch, minCGPA, placed, q } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (department) filter.department = department;
  if (batch) filter.batch = Number(batch);
  if (minCGPA) filter.cgpa = { $gte: Number(minCGPA) };
  if (placed === 'true') filter.placedAt = { $ne: null };
  if (placed === 'false') filter.placedAt = null;

  if (q) {
    const users = await User.find({
      role: 'student',
      $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
    }).select('_id');
    filter.user = { $in: users.map((u) => u._id) };
  }

  const [items, total] = await Promise.all([
    StudentProfile.find(filter)
      .populate('user', 'name email avatar phone')
      .sort({ cgpa: -1 })
      .skip(skip)
      .limit(limit),
    StudentProfile.countDocuments(filter),
  ]);

  return paged(res, { items, total, page, limit });
});

// @desc    Get a single student profile by id
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findById(req.params.id).populate(
    'user',
    'name email avatar phone'
  );
  if (!profile) {
    res.status(404);
    throw new Error('Student profile not found');
  }
  const applications = await Application.find({ student: profile.user._id }).populate(
    'job',
    'title status'
  );
  return ok(res, { profile, applications });
});
