import React from 'react';
import { Heart, Zap, CheckCircle, XCircle } from 'lucide-react';

const QuizScreen = ({ 
  questions, 
  currentQuestion, 
  selectedAnswer, 
  isAnswered, 
  score, 
  lives, 
  streak, 
  showCelebration,
  onAnswerSelect, 
  onNext 
}) => {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="duo-quiz-container">
      {showCelebration && (
        <div className="duo-celebration">
          <div className="duo-celebration-content">
            <div className="duo-celebration-emoji">🎉</div>
            <div className="duo-celebration-text">¡Correcto!</div>
          </div>
        </div>
      )}
      
      <div className="duo-quiz-header">
        <div className="duo-stats">
          <div className="duo-score">
            <Zap className="duo-score-icon" />
            <span className="duo-score-value">{score}</span>
            {streak > 0 && (
              <span className="duo-streak">
                🔥 {streak}
              </span>
            )}
          </div>
          
          <div className="duo-hearts">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`duo-heart ${i < lives ? 'duo-heart-full' : 'duo-heart-empty'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="duo-progress-container">
          <div className="duo-progress-bar">
            <div className="duo-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="duo-progress-text">
            {currentQuestion + 1} de {questions.length}
          </div>
        </div>
      </div>

      <div className="duo-question-card">
        <div className="duo-question-number">
          Pregunta {currentQuestion + 1}
        </div>
        <h2 className="duo-question-text">
          {question.question}
        </h2>

        <div className="duo-options">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correct;
            const isSelected = selectedAnswer === index;
            
            let className = 'duo-option';
            let icon = null;

            if (isAnswered) {
              if (isCorrect) {
                className += ' duo-option-correct';
                icon = <CheckCircle className="duo-option-icon" />;
              } else if (isSelected) {
                className += ' duo-option-incorrect';
                icon = <XCircle className="duo-option-icon" />;
              }
            }

            return (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                disabled={isAnswered}
                className={className}
              >
                <span className="duo-option-text">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="duo-next-container">
          <button
            onClick={onNext}
            className="duo-btn duo-btn-continue"
          >
            {currentQuestion < questions.length - 1 ? 'Continuar' : 'Ver Resultados'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
