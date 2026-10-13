import { Router } from 'express';
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  myPostedJobs,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

// 'mine' must come before '/:id' so it isn't treated as an id
router.get('/mine', authorize('alumni', 'admin'), myPostedJobs);

router.route('/').get(listJobs).post(authorize('admin', 'alumni'), createJob);
router
  .route('/:id')
  .get(getJob)
  .put(authorize('admin', 'alumni'), updateJob)
  .delete(authorize('admin', 'alumni'), deleteJob);

export default router;
