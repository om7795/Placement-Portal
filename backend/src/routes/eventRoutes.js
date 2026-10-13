import { Router } from 'express';
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleRegistration,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').get(listEvents).post(authorize('admin', 'alumni'), createEvent);
router.patch('/:id/register', toggleRegistration);
router
  .route('/:id')
  .get(getEvent)
  .put(authorize('admin', 'alumni'), updateEvent)
  .delete(authorize('admin', 'alumni'), deleteEvent);

export default router;
