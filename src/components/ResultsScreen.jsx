import React from 'react';
import { Trophy, Star, Award, Smile, Brain, Flame, Diamond } from 'lucide-react';
import AIFeedback from './AIFeedback';

const DIFFICULTY_LABELS = {
  facil: { icon: <Smile size={16} />, text: 'Fácil' },
  medio: { icon: <Brain size={16} />, text: 'Medio' },
  dificil: { icon: <Flame size={16} />, text: 'Difícil' },
  experto: { icon: <Diamond size={16} />, text: 'Experto' }
};

const ResultsScreen = ({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  topic, 
  difficulty,
  earnedPoints,
  totalPoints, 
  onRestart,
  questions,
  userAnswers
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = percentage >= 60;

  const handleFeedbackAction = (action) => {
    switch (action) {
      case 'Practicar preguntas específicas':
        onRestart();
        break;
      case 'Generar guía de estudio':
        if (window.onNavigateToGuide) {
          window.onNavigateToGuide(topic);
        }
        break;
      case 'Intentar nuevo quiz':
        onRestart();
        break;
      default:
        console.log('Acción no implementada:', action);
    }
  };

  return (
    <div className="duo-container">
      <div className="duo-card">
        <div className="duo-results-header">
          {passed ? (
            <div className="duo-avatar duo-avatar-gold">
              <Trophy className="duo-avatar-icon" aria-hidden="true" />
            </div>
          ) : (
            <div className="duo-avatar duo-avatar-silver">
              <Star className="duo-avatar-icon" aria-hidden="true" />
            </div>
          )}
          
          <h1 className="duo-title">
            {passed ? '¡Felicitaciones!' : '¡Buen Intento!'}
          </h1>
          <p className="duo-subtitle">
            {passed ? 'Has completado el quiz exitosamente' : 'Sigue practicando para mejorar'}
          </p>
        </div>

        <div className="duo-results-stats">
          <div className="duo-results-score">
            <div className="duo-results-score-value" aria-label={`Puntuación total: ${score} puntos`}>
              {score}
            </div>
            <div className="duo-results-score-label">puntos</div>
          </div>
          
          <div className="duo-results-breakdown">
            <div className="duo-results-item duo-results-correct">
              <div className="duo-results-number" aria-label={`${correctAnswers} respuestas correctas`}>
                {correctAnswers}
              </div>
              <div className="duo-results-label">Correctas</div>
            </div>
            <div className="duo-results-item duo-results-incorrect">
              <div className="duo-results-number" aria-label={`${totalQuestions - correctAnswers} respuestas incorrectas`}>
                {totalQuestions - correctAnswers}
              </div>
              <div className="duo-results-label">Incorrectas</div>
            </div>
          </div>

          <div className="duo-results-percentage">
            <div className="duo-results-percentage-value" aria-label={`${percentage} por ciento de aciertos`}>
              {percentage}%
            </div>
            <div className="duo-results-percentage-label">de aciertos</div>
          </div>
          
          <div style={{
            background: earnedPoints > 0 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #868f96 0%, #596164 100%)',
            padding: '20px',
            borderRadius: '16px',
            marginTop: '20px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
              <Award size={32} />
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {earnedPoints > 0 ? `+${earnedPoints}` : '0'}
              </div>
            </div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>
              {earnedPoints > 0 ? 'Puntos Ganados' : 'Sin puntos (necesitas al menos 50% de aciertos)'}
            </div>
            {earnedPoints > 0 && percentage === 100 && (
              <div style={{ 
                marginTop: '12px', 
                fontSize: '14px', 
                background: 'rgba(255,255,255,0.2)', 
                padding: '8px 12px', 
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                <Trophy size={16} className="inline mr-2" />
                ¡Perfecto! Obtuviste todos los puntos
              </div>
            )}
          </div>
          
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
              Total Acumulado
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Trophy size={24} />
              {totalPoints} puntos
            </div>
          </div>

          <div className="duo-results-topic">
            Tema: <strong>{topic}</strong><br />
            Dificultad: <strong>{DIFFICULTY_LABELS[difficulty].icon} {DIFFICULTY_LABELS[difficulty].text}</strong><br />
            Preguntas: <strong>{totalQuestions}</strong>
          </div>
        </div>

        {questions && userAnswers && (
          <div style={{ marginTop: '24px' }}>
            <AIFeedback 
              questions={questions}
              userAnswers={userAnswers}
              topic={topic}
              difficulty={difficulty}
              onAction={handleFeedbackAction}
            />
          </div>
        )}

        <button
          onClick={onRestart}
          className="btn btn-primary btn-shimmer duo-btn duo-btn-success"
          aria-label="Crear un nuevo quiz"
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>✨ Nuevo Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ResultsScreen);
