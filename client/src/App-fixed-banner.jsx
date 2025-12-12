import React, { useState } from 'react';
import { Heart, Star, Trophy, Sparkles, CheckCircle, XCircle, Zap, Loader, Award, BookOpen } from 'lucide-react';
import { usePoints } from './hooks/usePoints';
import GuideInput from './components/GuideInput';
import GuideViewer from './components/GuideViewer';
import './styles/guideStyles.css';

function App() {
  // 🔑 API KEY desde variables de entorno (ahora usa Groq)
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  const [screen, setScreen] = useState('input');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medio');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  // Estados para la guía de estudio
  const [guide, setGuide] = useState(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  
  // Hook de puntos
  const { totalPoints, calculatePoints, addPoints, POINTS_BY_DIFFICULTY } = usePoints();

  // ... (resto de las funciones existentes)

  // Renderizar la pantalla de carga del quiz
  if (screen === 'loading') {
    return (
      <div className="duo-container">
        <div className="duo-card">
          <div className="duo-loading">
            <div className="duo-loading-spinner">
              <Loader />
            </div>
            <h2 className="duo-loading-title">
              Generando tu quiz...
            </h2>
            <p className="duo-loading-text">
              La IA está creando preguntas sobre: <strong>{topic}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la pantalla de carga de guía
  if (screen === 'guide_loading') {
    return (
      <div className="duo-container">
        <div className="duo-card">
          <div className="duo-loading">
            <div className="duo-loading-spinner">
              <Loader />
            </div>
            <h2 className="duo-loading-title">
              Generando tu guía de estudio...
            </h2>
            <p className="duo-loading-text">
              La IA está creando una guía personalizada sobre: <strong>{topic}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la vista de la guía
  if (screen === 'guide' && guide) {
    return (
      <div className="guide-container">
        <GuideViewer guide={guide} onBack={handleBackToMenu} />
      </div>
    );
  }

  // Renderizar el menú principal
  if (screen === 'input' || screen === 'guide_input') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Banner de bienvenida */}
        <div style={{
          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
          color: 'white',
          padding: '1.5rem',
          width: '100%',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600' }}>¡Hola usuario!</h2>
          <p style={{ margin: '0.5rem 0 0', opacity: '0.9', fontSize: '1.1rem' }}>Bienvenido a tu plataforma de estudio</p>
        </div>

        {/* Contenido principal */}
        <div style={{ 
          flex: 1,
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem 1rem', 
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Tarjeta de Quiz */}
          <div className="duo-card" style={{
            marginBottom: '2rem',
            opacity: screen === 'input' ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
            ':hover': {
              opacity: 1
            }
          }}>
            <h2 style={{ marginTop: 0 }}>Crear un Quiz</h2>
            <p>Genera un cuestionario personalizado sobre cualquier tema</p>
            <button 
              onClick={() => setScreen('input')}
              className="duo-btn duo-btn-primary"
            >
              Crear Quiz
            </button>
          </div>

          {/* Tarjeta de Guía de Estudio */}
          <div className="duo-card" style={{
            marginBottom: '2rem',
            opacity: screen === 'guide_input' ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
            ':hover': {
              opacity: 1
            }
          }}>
            <h2 style={{ marginTop: 0 }}>Crear Guía de Estudio</h2>
            <p>Genera una guía de estudio detallada sobre cualquier tema</p>
            <button 
              onClick={() => setScreen('guide_input')}
              className="duo-btn duo-btn-secondary"
            >
              Crear Guía
            </button>
          </div>
        </div>

        {/* Badge de puntos totales */}
        <div className="points-badge" style={{ 
          position: 'fixed', 
          top: '120px',
          right: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '8px 16px',
          borderRadius: '20px',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          zIndex: 1000
        }}>
          <Award size={20} />
          <span>{totalPoints} pts</span>
        </div>
      </div>
    );
  }

  // Resto del código...
  
  return null;
}

export default App;
