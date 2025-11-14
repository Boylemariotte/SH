import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
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

  if (!history || history.length === 0) {
    return (
      <div className="no-history">
        <p>No hay historial de quizzes aún.</p>
      </div>
    );
  }

  return (
    <div className="quiz-history">
      <h3>Historial de Quizzes</h3>
      <div className="history-list">
        {history.map((quiz, index) => (
          <div key={index} className="quiz-card">
            <div 
              className="quiz-summary" 
              onClick={() => toggleExpand(index)}
            >
              <div className="quiz-header">
                <span className="quiz-date">
                  <Clock size={16} /> {formatDate(quiz.timestamp)}
                </span>
                <span className={`quiz-score ${quiz.score >= 70 ? 'high-score' : 'low-score'}`}>
                  {quiz.score}%
                </span>
                {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <div className="quiz-stats">
                {quiz.correctAnswers} de {quiz.totalQuestions} respuestas correctas
              </div>
            </div>
            
            {expandedIndex === index && (
              <div className="quiz-details">
                <h4>Detalles del Quiz</h4>
                <div className="questions-list">
                  {quiz.questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-item">
                      <p className="question-text">{q.question}</p>
                      <div className="answer user-answer">
                        <span>Tu respuesta:</span>
                        <span className={q.userAnswer === q.correctAnswer ? 'correct' : 'incorrect'}>
                          {q.userAnswer}
                          {q.userAnswer === q.correctAnswer ? (
                            <CheckCircle size={16} className="icon" />
                          ) : (
                            <XCircle size={16} className="icon" />
                          )}
                        </span>
                      </div>
                      {q.userAnswer !== q.correctAnswer && (
                        <div className="answer correct-answer">
                          <span>Respuesta correcta:</span>
                          <span>{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  ))}
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
