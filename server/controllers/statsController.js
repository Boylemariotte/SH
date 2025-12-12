import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Obtener estadísticas del usuario
// @route   GET /api/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('stats recentQuizzes recentPointsHistory');

    // Calcular estadísticas adicionales
    const recentAttempts = await QuizAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const quizzesByDifficulty = {};
    const topicsStudied = new Set();

    recentAttempts.forEach(attempt => {
      quizzesByDifficulty[attempt.difficulty] = (quizzesByDifficulty[attempt.difficulty] || 0) + 1;
      topicsStudied.add(attempt.topic);
    });

    res.json({
      stats: user.stats,
      recentQuizzes: user.recentQuizzes.slice(0, 10),
      recentPointsHistory: user.recentPointsHistory.slice(0, 20),
      additionalStats: {
        quizzesByDifficulty,
        uniqueTopicsStudied: topicsStudied.size,
        recentAttemptsCount: recentAttempts.length
      }
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

// @desc    Obtener historial completo de puntos
// @route   GET /api/stats/points
// @access  Private
export const getPointsHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const pointsHistory = await PointsHistory.find({ user: userId })
      .populate('quizAttempt', 'topic difficulty score')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await PointsHistory.countDocuments({ user: userId });
    const totalPoints = await PointsHistory.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    res.json({
      pointsHistory,
      total,
      totalPoints: totalPoints[0]?.total || 0,
      limit,
      skip
    });
  } catch (error) {
    console.error('Error getting points history:', error);
    res.status(500).json({ message: 'Error al obtener historial de puntos', error: error.message });
  }
};

// @desc    Obtener ranking de usuarios
// @route   GET /api/stats/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'totalPoints'; // totalPoints, totalQuizzes, dailyStreak

    const users = await User.find({ isActive: true })
      .select('username stats')
      .sort({ [`stats.${sortBy}`]: -1 })
      .limit(limit);

    res.json({
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        stats: user.stats
      })),
      sortBy
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ message: 'Error al obtener el ranking', error: error.message });
  }
};

// @desc    Actualizar preferencias del usuario
// @route   PUT /api/stats/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { defaultDifficulty, defaultNumQuestions, theme } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (defaultDifficulty) {
      user.preferences.defaultDifficulty = defaultDifficulty;
    }
    if (defaultNumQuestions) {
      user.preferences.defaultNumQuestions = defaultNumQuestions;
    }
    if (theme) {
      user.preferences.theme = theme;
    }

    await user.save();

    res.json({
      message: 'Preferencias actualizadas',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error al actualizar preferencias', error: error.message });
  }
};

