import { Router } from 'express';
import {
  getMyProfile,
  upsertMyProfile,
  listAlumni,
  listMentors,
  approveAlumni,
  listPending,
} from '../controllers/alumniController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

// Admin-only routes first (so /pending isn't swallowed by /:id-style routes)
router.get('/pending', authorize('admin'), listPending);
router.patch('/:userId/approve', authorize('admin'), approveAlumni);

router.get('/me', authorize('alumni'), getMyProfile);
router.put('/me', authorize('alumni'), upsertMyProfile);
router.get('/mentors', listMentors);
router.get('/', listAlumni);

export default router;
