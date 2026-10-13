import Event from '../models/Event.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';

// @desc    List events
// @route   GET /api/events?type=&upcoming=true
// @access  Private
export const listEvents = asyncHandler(async (req, res) => {
  const { type, upcoming } = req.query;
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20 });

  const filter = { isPublished: true };
  if (type) filter.type = type;
  if (upcoming === 'true') filter.date = { $gte: new Date() };

  const [items, total] = await Promise.all([
    Event.find(filter)
      .populate('company', 'name logo')
      .populate('organizer', 'name role')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filter),
  ]);
  return paged(res, { items, total, page, limit });
});

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('company', 'name logo')
    .populate('organizer', 'name role');
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  return ok(res, event);
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private (admin, alumni)
export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  return created(res, event, 'Event created');
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (admin, or the organizer)
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (req.user.role !== 'admin' && String(event.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only edit events you organized');
  }
  Object.assign(event, req.body);
  await event.save();
  return ok(res, event, 'Event updated');
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (admin, or the organizer)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (req.user.role !== 'admin' && String(event.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('You can only delete events you organized');
  }
  await event.deleteOne();
  return ok(res, null, 'Event deleted');
});

// @desc    Register / unregister for an event
// @route   PATCH /api/events/:id/register
// @access  Private
export const toggleRegistration = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  const idx = event.registrations.findIndex((u) => String(u) === String(req.user._id));
  if (idx >= 0) {
    event.registrations.splice(idx, 1);
  } else {
    event.registrations.push(req.user._id);
  }
  await event.save();
  return ok(res, { registered: idx < 0, count: event.registrations.length }, 'Registration updated');
});
