import { Router } from 'express';
import {
  applyToJob,
  myApplications,
  jobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/mine', authorize('student'), myApplications);
router.get('/job/:jobId', authorize('admin', 'alumni'), jobApplications);
router.post('/', authorize('student'), applyToJob);
router.patch('/:id/status', authorize('admin', 'alumni'), updateApplicationStatus);
router.patch('/:id/withdraw', authorize('student'), withdrawApplication);

export default router;
