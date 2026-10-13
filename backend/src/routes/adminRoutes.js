import { Router } from 'express';
import { dashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/stats', dashboardStats);

export default router;
