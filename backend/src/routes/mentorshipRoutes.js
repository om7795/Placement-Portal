import { Router } from 'express';
import {
  createRequest,
  myRequests,
  respondToRequest,
} from '../controllers/mentorshipController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/mine', myRequests);
router.post('/', authorize('student'), createRequest);
router.patch('/:id/respond', authorize('alumni'), respondToRequest);

export default router;
