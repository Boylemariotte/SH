import React from 'react';
import { Heart, Zap } from 'lucide-react';

const QuizHeader = ({ score, streak, lives, currentQuestion, totalQuestions }) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="duo-quiz-header">
      <div className="duo-stats">
        <div className="duo-score">
          <Zap className="duo-score-icon" aria-hidden="true" />
          <span className="duo-score-value" aria-label={`Puntuación: ${score}`}>
            {score}
          </span>
          {streak > 0 && (
            <span className="duo-streak" aria-label={`Racha de ${streak} respuestas correctas`}>
              🔥 {streak}
            </span>
          )}
        </div>
        
        <div className="duo-hearts" role="status" aria-label={`${lives} vidas restantes`}>
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`duo-heart ${i < lives ? 'duo-heart-full' : 'duo-heart-empty'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      
      <div className="duo-progress-container">
        <div className="duo-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="duo-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="duo-progress-text">
          {currentQuestion + 1} de {totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuizHeader);
