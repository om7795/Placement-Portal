import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import AlumniProfile from '../models/AlumniProfile.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { notify } from '../utils/notify.js';

// @desc    Register a new user (student or alumni)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'student', ...profile } = req.body;

  if (!['student', 'alumni'].includes(role)) {
    res.status(400);
    throw new Error('Role must be either student or alumni');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Alumni require admin approval before appearing in the directory
  const user = await User.create({
    name,
    email,
    password,
    role,
    isApproved: role === 'student',
  });

  if (role === 'student') {
    await StudentProfile.create({
      user: user._id,
      batch: profile.batch || new Date().getFullYear() + 3,
      department: profile.department || 'CSE',
    });
  } else {
    await AlumniProfile.create({
      user: user._id,
      graduationYear: profile.graduationYear || new Date().getFullYear() - 3,
      department: profile.department || 'CSE',
      company: profile.company || '',
    });
  }

  await notify({
    user: user._id,
    title: 'Welcome to the Placement & Alumni Portal',
    message:
      role === 'alumni'
        ? 'Your alumni account is pending admin approval. You will be notified once approved.'
        : 'Complete your profile to start applying to jobs and internships.',
    type: 'system',
  });

  const token = signToken(user._id, user.role);
  return created(res, { user: user.toSafeJSON(), token }, 'Registered successfully');
});

// @desc    Authenticate a user and return a JWT
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated. Contact the placement office.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id, user.role);
  return ok(res, { user: user.toSafeJSON(), token }, 'Logged in successfully');
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const me = asyncHandler(async (req, res) => {
  let profile = null;
  if (req.user.role === 'student') {
    profile = await StudentProfile.findOne({ user: req.user._id });
  } else if (req.user.role === 'alumni') {
    profile = await AlumniProfile.findOne({ user: req.user._id });
  }
  return ok(res, { user: req.user.toSafeJSON(), profile });
});

// @desc    Update basic account fields
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  return ok(res, user.toSafeJSON(), 'Account updated');
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  return ok(res, null, 'Password updated successfully');
});
