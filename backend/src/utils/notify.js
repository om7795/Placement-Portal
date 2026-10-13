import Notification from '../models/Notification.js';

/**
 * Fire-and-forget notification creator. Never throws into the caller.
 */
export async function notify({ user, title, message = '', type = 'system', link = '' }) {
  try {
    if (!user) return null;
    return await Notification.create({ user, title, message, type, link });
  } catch (err) {
    console.error('notify() failed:', err.message);
    return null;
  }
}

export default notify;
