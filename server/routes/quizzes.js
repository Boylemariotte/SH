import express from 'express';
import {
  createQuiz,
  saveQuizAttempt,
  getMyQuizzes,
  getQuizAttempts,
  getQuizAttempt,
  searchQuizzes
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.post('/', createQuiz);
router.post('/attempts', saveQuizAttempt);
router.get('/my-quizzes', getMyQuizzes);
router.get('/attempts', getQuizAttempts);
router.get('/attempts/:id', getQuizAttempt);
router.get('/search', searchQuizzes);

export default router;

