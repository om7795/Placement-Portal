import { Router } from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import alumniRoutes from './alumniRoutes.js';
import companyRoutes from './companyRoutes.js';
import jobRoutes from './jobRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import mentorshipRoutes from './mentorshipRoutes.js';
import eventRoutes from './eventRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Placement & Alumni Portal API',
    endpoints: [
      '/api/auth',
      '/api/students',
      '/api/alumni',
      '/api/companies',
      '/api/jobs',
      '/api/applications',
      '/api/mentorship',
      '/api/events',
      '/api/notifications',
      '/api/admin',
      '/api/ai',
    ],
  });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/alumni', alumniRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/events', eventRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);

export default router;
