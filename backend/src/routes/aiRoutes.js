import { Router } from 'express';
import { aiHealth, matchResume, recommendJobs } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/health', aiHealth);
router.post('/match', matchResume);
router.post('/recommend', recommendJobs);

export default router;
