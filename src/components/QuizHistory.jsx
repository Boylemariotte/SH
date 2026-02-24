import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Award, Target, TrendingUp } from 'lucide-react';
import '../styles/quizHistory.css';

const QuizHistory = ({ history }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      facil: '#10b981',
      medio: '#f59e0b', 
      dificil: '#ef4444',
      experto: '#a855f7'
    };
    return colors[difficulty] || '#6b7280';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 70) return '🎯';
    if (score >= 50) return '💪';
    return '📚';
  };

  if (!history || history.length === 0) {
    return (
      <div className="no-history">
        <div className="no-history-icon">📊</div>
        <h3>No hay historial de quizzes</h3>
        <p>Completa tu primer quiz para ver tu progreso aquí</p>
      </div>
    );
  }

  return (
    <div className="quiz-history">
      <div className="history-header">
        <h3>Historial de Quizzes</h3>
        <div className="history-stats">
          <div className="stat-item">
            <Target size={16} />
            <span>{history.length} quizzes</span>
          </div>
          <div className="stat-item">
            <TrendingUp size={16} />
            <span>{Math.round(history.reduce((acc, q) => acc + q.score, 0) / history.length)}% promedio</span>
          </div>
        </div>
      </div>
      
      <div className="history-list">
        {history.map((quiz, index) => (
          <div key={index} className="quiz-card">
            <div 
              className="quiz-summary" 
              onClick={() => toggleExpand(index)}
            >
              <div className="quiz-main-info">
                <div className="quiz-title-row">
                  <div className="quiz-topic">
                    <span className="topic-emoji">{getScoreEmoji(quiz.score)}</span>
                    <span className="topic-text">{quiz.topic || 'Quiz'}</span>
                  </div>
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                  >
                    {quiz.difficulty}
                  </div>
                </div>
                
                <div className="quiz-meta">
                  <span className="quiz-date">
                    <Clock size={14} />
                    {formatDate(quiz.timestamp || quiz.date)}
                  </span>
                  <div className="quiz-score-info">
                    <span className={`quiz-score ${quiz.score >= 70 ? 'high-score' : 'low-score'}`}>
                      {quiz.score}%
                    </span>
                    <span className="quiz-accuracy">
                      {quiz.correctAnswers || quiz.score}/{quiz.totalQuestions || 5}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="quiz-points-row">
                {quiz.points && (
                  <div className="points-earned">
                    <Award size={14} />
                    <span>+{quiz.points} pts</span>
                  </div>
                )}
                <div className="expand-icon">
                  {expandedIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>
            
            {expandedIndex === index && (
              <div className="quiz-details">
                <div className="details-header">
                  <h4>Detalles del Quiz</h4>
                  <div className="details-stats">
                    <div className="detail-stat">
                      <span className="stat-label">Puntuación</span>
                      <span className="stat-value">{quiz.score}%</span>
                    </div>
                    <div className="detail-stat">
                      <span className="stat-label">Correctas</span>
                      <span className="stat-value">{quiz.correctAnswers || quiz.score}/{quiz.totalQuestions || 5}</span>
                    </div>
                    {quiz.points && (
                      <div className="detail-stat">
                        <span className="stat-label">Puntos</span>
                        <span className="stat-value">+{quiz.points}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="questions-preview">
                  <p className="preview-text">
                    {quiz.questions ? 
                      `Revisa las ${quiz.questions.length} preguntas de este quiz` : 
                      'Quiz completado con éxito'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
