import express from 'express';
import {
  createStudyGuide,
  getMyStudyGuides,
  getStudyGuide,
  searchStudyGuides,
  deleteStudyGuide
} from '../controllers/guideController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/', createStudyGuide);
router.get('/', getMyStudyGuides);
router.get('/search', searchStudyGuides);
router.get('/:id', getStudyGuide);
router.delete('/:id', deleteStudyGuide);

export default router;

