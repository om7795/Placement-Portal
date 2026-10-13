import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { notify } from '../utils/notify.js';

// @desc    Request mentorship from an alumni
// @route   POST /api/mentorship
// @access  Private (student)
export const createRequest = asyncHandler(async (req, res) => {
  const { alumniId, topic, message } = req.body;

  const alumni = await User.findById(alumniId);
  if (!alumni || alumni.role !== 'alumni') {
    res.status(404);
    throw new Error('Alumni not found');
  }

  const request = await MentorshipRequest.create({
    student: req.user._id,
    alumni: alumniId,
    topic,
    message,
  });

  await notify({
    user: alumniId,
    title: 'New mentorship request',
    message: `${req.user.name} requested mentorship on "${topic}".`,
    type: 'mentorship',
    link: '/mentorship',
  });

  return created(res, request, 'Mentorship request sent');
});

// @desc    Requests I sent (student) or received (alumni)
// @route   GET /api/mentorship/mine
// @access  Private
export const myRequests = asyncHandler(async (req, res) => {
  const key = req.user.role === 'student' ? 'student' : 'alumni';
  const requests = await MentorshipRequest.find({ [key]: req.user._id })
    .populate('student', 'name email avatar')
    .populate('alumni', 'name email avatar')
    .sort({ createdAt: -1 });
  return ok(res, requests);
});

// @desc    Respond to a mentorship request (alumni)
// @route   PATCH /api/mentorship/:id/respond
// @access  Private (alumni)
export const respondToRequest = asyncHandler(async (req, res) => {
  const { status, response = '', scheduledAt } = req.body;
  const request = await MentorshipRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (String(request.alumni) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only respond to requests addressed to you');
  }

  request.status = status;
  request.response = response;
  if (scheduledAt) request.scheduledAt = scheduledAt;
  await request.save();

  await notify({
    user: request.student,
    title: `Mentorship ${status}`,
    message: `Your mentorship request was ${status}.${response ? ` Note: ${response}` : ''}`,
    type: 'mentorship',
    link: '/mentorship',
  });

  return ok(res, request, 'Response sent');
});
