import { useState, useEffect } from 'react';

// Puntos base por dificultad (100% de aciertos)
const POINTS_BY_DIFFICULTY = {
  facil: 10,
  medio: 20,
  dificil: 30,
  experto: 50
};

export const usePoints = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);

  // Cargar puntos desde localStorage al iniciar
  useEffect(() => {
    const savedPoints = localStorage.getItem('quiz_total_points');
    const savedHistory = localStorage.getItem('quiz_points_history');
    
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints, 10));
    }
    
    if (savedHistory) {
      setPointsHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Guardar puntos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('quiz_total_points', totalPoints.toString());
  }, [totalPoints]);

  useEffect(() => {
    localStorage.setItem('quiz_points_history', JSON.stringify(pointsHistory));
  }, [pointsHistory]);

  /**
   * Calcula los puntos ganados basado en el rendimiento
   * @param {string} difficulty - Nivel de dificultad (facil, medio, dificil, experto)
   * @param {number} correctAnswers - Número de respuestas correctas
   * @param {number} totalQuestions - Total de preguntas
   * @returns {number} Puntos ganados
   */
  const calculatePoints = (difficulty, correctAnswers, totalQuestions) => {
    const basePoints = POINTS_BY_DIFFICULTY[difficulty] || 10;
    const percentage = correctAnswers / totalQuestions;
    
    // Solo otorgar puntos completos si se responde todo correctamente
    if (percentage === 1) {
      return basePoints;
    }
    
    // Puntos parciales basados en el porcentaje (mínimo 50% para ganar puntos)
    if (percentage >= 0.5) {
      return Math.floor(basePoints * percentage);
    }
    
    return 0;
  };

  /**
   * Agrega puntos al total del usuario
   * @param {number} points - Puntos a agregar
   * @param {object} quizData - Datos del quiz completado
   */
  const addPoints = (points, quizData = {}) => {
    setTotalPoints(prev => prev + points);
    
    // Agregar al historial
    const historyEntry = {
      points,
      date: new Date().toISOString(),
      topic: quizData.topic || 'Quiz',
      difficulty: quizData.difficulty || 'medio',
      correctAnswers: quizData.correctAnswers || 0,
      totalQuestions: quizData.totalQuestions || 0
    };
    
    setPointsHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Mantener últimos 50
  };

  /**
   * Reinicia los puntos totales (para testing o reset)
   */
  const resetPoints = () => {
    setTotalPoints(0);
    setPointsHistory([]);
    localStorage.removeItem('quiz_total_points');
    localStorage.removeItem('quiz_points_history');
  };

  /**
   * Obtiene estadísticas de puntos
   */
  const getStats = () => {
    const quizzesByDifficulty = pointsHistory.reduce((acc, entry) => {
      acc[entry.difficulty] = (acc[entry.difficulty] || 0) + 1;
      return acc;
    }, {});

    const totalQuizzes = pointsHistory.length;
    const averagePoints = totalQuizzes > 0 
      ? Math.round(pointsHistory.reduce((sum, entry) => sum + entry.points, 0) / totalQuizzes)
      : 0;

    return {
      totalPoints,
      totalQuizzes,
      averagePoints,
      quizzesByDifficulty,
      lastQuiz: pointsHistory[0] || null
    };
  };

  return {
    totalPoints,
    pointsHistory,
    calculatePoints,
    addPoints,
    resetPoints,
    getStats,
    POINTS_BY_DIFFICULTY
  };
};
