import React from 'react';

const StatsCards = ({ dailyStreak, accuracyPercentage, totalQuizzes }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      maxWidth: '1200px',
      margin: '0 auto 2rem auto',
      flexWrap: 'wrap'
    }}>
      {/* Racha diaria */}
      <div style={{
        minWidth: '140px',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {dailyStreak}
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9, textAlign: 'center' }}>Racha de días</div>
      </div>
      
      {/* Porcentaje de aciertos */}
      <div style={{
        minWidth: '140px',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {accuracyPercentage}%
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9, textAlign: 'center' }}>Aciertos</div>
      </div>
      
      {/* Total de quizzes */}
      <div style={{
        minWidth: '140px',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {totalQuizzes}
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9, textAlign: 'center' }}>Quizzes completados</div>
      </div>
    </div>
  );
};

export default StatsCards;
