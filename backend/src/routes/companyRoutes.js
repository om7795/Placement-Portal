import { Router } from 'express';
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').get(listCompanies).post(authorize('admin'), createCompany);
router
  .route('/:id')
  .get(getCompany)
  .put(authorize('admin'), updateCompany)
  .delete(authorize('admin'), deleteCompany);

export default router;
