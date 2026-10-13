import { Router } from 'express';
import {
  getMyProfile,
  upsertMyProfile,
  listStudents,
  getStudentById,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me', authorize('student'), getMyProfile);
router.put('/me', authorize('student'), upsertMyProfile);
router.get('/', authorize('admin'), listStudents);
router.get('/:id', authorize('admin', 'alumni'), getStudentById);

export default router;
