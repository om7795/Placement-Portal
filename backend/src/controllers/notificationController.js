import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';

// @desc    My notifications
// @route   GET /api/notifications?unread=true
// @access  Private
export const listNotifications = asyncHandler(async (req, res) => {
  const { unread } = req.query;
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20 });

  const filter = { user: req.user._id };
  if (unread === 'true') filter.read = false;

  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);
  return paged(res, { items, total, page, limit });
});

// @desc    Mark one notification read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!n) {
    res.status(404);
    throw new Error('Notification not found');
  }
  return ok(res, n, 'Marked as read');
});

// @desc    Mark all notifications read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return ok(res, null, 'All notifications marked read');
});

// @desc    Unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const unreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  return ok(res, { count });
});
