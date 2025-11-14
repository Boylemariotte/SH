import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  currentQuestion, 
  selectedAnswer, 
  isAnswered, 
  onAnswerSelect 
}) => {
  return (
    <div className="duo-question-card">
      <div className="duo-question-number">
        Pregunta {currentQuestion + 1}
      </div>
      <h2 className="duo-question-text">
        {question.question}
      </h2>

      <div className="duo-options" role="radiogroup" aria-label="Opciones de respuesta">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correct;
          const isSelected = selectedAnswer === index;
          
          let className = 'duo-option';
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              className += ' duo-option-correct';
              icon = <CheckCircle className="duo-option-icon" aria-label="Respuesta correcta" />;
            } else if (isSelected) {
              className += ' duo-option-incorrect';
              icon = <XCircle className="duo-option-icon" aria-label="Respuesta incorrecta" />;
            }
          }

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={isAnswered}
              className={className}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Opción ${index + 1}: ${option}`}
            >
              <span className="duo-option-text">{option}</span>
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(QuestionCard);
