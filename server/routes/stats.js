import express from 'express';
import {
  getUserStats,
  getPointsHistory,
  getLeaderboard,
  updatePreferences
} from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.get('/', getUserStats);
router.get('/points', getPointsHistory);
router.get('/leaderboard', getLeaderboard);
router.put('/preferences', updatePreferences);

export default router;
