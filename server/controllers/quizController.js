import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';

// @desc    Crear un nuevo quiz
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions, questions, source, sourceFile } = req.body;
    const userId = req.user._id;

    const quiz = await Quiz.create({
      topic,
      difficulty,
      numQuestions,
      questions,
      createdBy: userId,
      source: source || 'ai',
      sourceFile: sourceFile || null
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Error al crear el quiz', error: error.message });
  }
};

// @desc    Guardar un intento de quiz
// @route   POST /api/quizzes/attempts
// @access  Private
export const saveQuizAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      quizId,
      topic,
      difficulty,
      numQuestions,
      answers,
      score,
      correctAnswers,
      totalQuestions,
      pointsEarned,
      livesRemaining,
      streak,
      duration
    } = req.body;

    // Crear el intento
    const attempt = await QuizAttempt.create({
      user: userId,
      quiz: quizId,
      topic,
      difficulty,
      numQuestions,
      answers,
      score,
      correctAnswers,
      totalQuestions,
      pointsEarned: pointsEarned || 0,
      livesRemaining: livesRemaining || 3,
      streak: streak || 0,
      duration: duration || 0
    });

    // Actualizar estadísticas del usuario (desnormalización)
    const user = await User.findById(userId);
    if (user) {
      user.updateStats({
        correctAnswers,
        totalQuestions,
        score,
        pointsEarned: pointsEarned || 0
      });

      // Agregar quiz reciente
      user.addRecentQuiz({
        quizId: quizId || attempt._id,
        topic,
        difficulty,
        score,
        correctAnswers,
        totalQuestions,
        pointsEarned: pointsEarned || 0
      });

      // Agregar puntos al historial
      if (pointsEarned > 0) {
        user.addPointsHistory({
          points: pointsEarned,
          source: 'quiz',
          topic,
          difficulty
        });

        // También guardar en PointsHistory (colección separada para historial completo)
        await PointsHistory.create({
          user: userId,
          points: pointsEarned,
          source: 'quiz',
          quizAttempt: attempt._id,
          metadata: {
            topic,
            difficulty,
            correctAnswers,
            totalQuestions
          }
        });
      }

      await user.save();
    }

    // Actualizar estadísticas del quiz
    if (quizId) {
      const quiz = await Quiz.findById(quizId);
      if (quiz) {
        quiz.timesUsed += 1;
        // Calcular promedio de puntajes
        const allAttempts = await QuizAttempt.find({ quiz: quizId });
        const avgScore = allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length;
        quiz.averageScore = Math.round(avgScore);
        await quiz.save();
      }
    }

    res.status(201).json({
      attempt,
      userStats: user.stats,
      message: 'Intento guardado exitosamente'
    });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    res.status(500).json({ message: 'Error al guardar el intento', error: error.message });
  }
};

// @desc    Obtener quizzes del usuario
// @route   GET /api/quizzes/my-quizzes
// @access  Private
export const getMyQuizzes = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('recentQuizzes stats');
    
    res.json({
      recentQuizzes: user.recentQuizzes || [],
      stats: user.stats
    });
  } catch (error) {
    console.error('Error getting user quizzes:', error);
    res.status(500).json({ message: 'Error al obtener los quizzes', error: error.message });
  }
};

// @desc    Obtener historial completo de intentos
// @route   GET /api/quizzes/attempts
// @access  Private
export const getQuizAttempts = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const attempts = await QuizAttempt.find({ user: userId })
      .populate('quiz', 'topic difficulty numQuestions')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await QuizAttempt.countDocuments({ user: userId });

    res.json({
      attempts,
      total,
      limit,
      skip
    });
  } catch (error) {
    console.error('Error getting quiz attempts:', error);
    res.status(500).json({ message: 'Error al obtener los intentos', error: error.message });
  }
};

// @desc    Obtener un intento específico
// @route   GET /api/quizzes/attempts/:id
// @access  Private
export const getQuizAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const attemptId = req.params.id;

    const attempt = await QuizAttempt.findOne({ _id: attemptId, user: userId })
      .populate('quiz')
      .populate('user', 'username');

    if (!attempt) {
      return res.status(404).json({ message: 'Intento no encontrado' });
    }

    res.json(attempt);
  } catch (error) {
    console.error('Error getting quiz attempt:', error);
    res.status(500).json({ message: 'Error al obtener el intento', error: error.message });
  }
};

// @desc    Buscar quizzes por tema
// @route   GET /api/quizzes/search
// @access  Private
export const searchQuizzes = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const query = {};

    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(quizzes);
  } catch (error) {
    console.error('Error searching quizzes:', error);
    res.status(500).json({ message: 'Error al buscar quizzes', error: error.message });
  }
};

