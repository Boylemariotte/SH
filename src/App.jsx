import React, { useState, useEffect } from 'react';
import { Heart, Star, Trophy, Sparkles, CheckCircle, XCircle, Zap, Loader, Award, BookOpen, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { usePoints } from './hooks/usePoints';
import GuideInput from './components/GuideInput';
import GuideViewer from './components/GuideViewer';
import QuizHistory from './components/QuizHistory';
import QuizScreen from './components/QuizScreen';
import StatsCards from './components/StatsCards';
import ResultsScreen from './components/ResultsScreen';
import LoadingScreen from './components/LoadingScreen';
import StudyFromFile from './components/StudyFromFile';
import './styles/guideStyles.css';
import './styles/quizHistory.css';
import './styles/FileUpload.css';

// URL dinámica de la API
const getApiUrl = () => {
  // En producción (Vercel), usar rutas relativas
  if (import.meta.env.PROD) {
    return ''; // Rutas relativas: /api/endpoint
  }
  // En desarrollo, usar localhost
  return 'http://localhost:3001';
};

// Obtener API key según el entorno
const getApiKey = () => {
  // En producción, no enviar API key (la maneja el servidor)
  if (import.meta.env.PROD) {
    return null;
  }
  // En desarrollo, enviar API key del frontend
  return import.meta.env.VITE_GROQ_API_KEY;
};

function App() {
  // 🔑 API KEY desde variables de entorno (ahora usa Groq)
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  // Estado para controlar la visibilidad del historial
  const [showHistory, setShowHistory] = useState(false);
  
  // Función para alternar la visibilidad del historial
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  const [screen, setScreen] = useState('input'); // Cambiado de 'setup' a 'input'
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
  
  // Estados para estadísticas del usuario
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      dailyStreak: 0,
      lastQuizDate: null,
      totalQuizzes: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0
    };
  });

  // Load quiz history only once when component mounts (máximo 3 entradas)
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('quizHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading quiz history:', error);
      return [];
    }
  });
  

  // Calcular porcentaje de aciertos
  const accuracyPercentage = userStats.totalQuestions > 0 
    ? Math.round((userStats.totalCorrectAnswers / userStats.totalQuestions) * 100)
    : 0;
  
  // Asegurar que los valores no sean NaN
  const safeStats = {
    dailyStreak: userStats.dailyStreak || 0,
    totalQuizzes: userStats.totalQuizzes || 0,
    accuracyPercentage: isNaN(accuracyPercentage) ? 0 : accuracyPercentage
  };

  const generateQuizWithAI = async (topicInput) => {
    try {
      setError('');
      
      const difficultyPrompts = {
        facil: 'Las preguntas deben ser básicas y para principiantes, con respuestas directas.',
        medio: 'Las preguntas deben ser de nivel intermedio, requiriendo comprensión del tema.',
        dificil: 'Las preguntas deben ser avanzadas y desafiantes, requiriendo conocimiento profundo.',
        experto: 'Las preguntas deben ser de nivel experto, con detalles técnicos y conceptos avanzados.'
      };
      
      const prompt = `Genera exactamente ${numQuestions} preguntas de opción múltiple sobre el tema: "${topicInput}".

NIVEL DE DIFICULTAD: ${difficulty.toUpperCase()}
${difficultyPrompts[difficulty]}

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional antes o después.

Formato requerido:
[
  {
    "question": "Pregunta clara y específica sobre el tema",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0
  }
]

El campo "correct" debe ser el índice (0-3) de la respuesta correcta.
Asegúrate de que las preguntas sean educativas, las opciones sean plausibles y en español.
IMPORTANTE: Las opciones incorrectas deben ser convincentes y relacionadas con el tema.`;

      const response = await fetch(`${getApiUrl()}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          ...(getApiKey() && { apiKey: getApiKey() }) // Solo en desarrollo
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Procesar respuesta de Groq (formato OpenAI)
      let content = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content;
      } else if (Array.isArray(data) && data.length > 0) {
        content = data[0].generated_text || data[0];
      } else if (data.generated_text) {
        content = data.generated_text;
      } else if (typeof data === 'string') {
        content = data;
      }
      console.log('Generated content:', content);
      
      let cleanContent = content.trim();
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('La IA no generó el formato correcto. Intenta de nuevo.');
      }

      const parsedQuestions = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('No se generaron preguntas válidas.');
      }

      const validQuestions = parsedQuestions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 4 && 
        typeof q.correct === 'number' && 
        q.correct >= 0 && 
        q.correct <= 3
      );

      if (validQuestions.length === 0) {
        throw new Error('Las preguntas generadas no tienen el formato correcto.');
      }

      return validQuestions.slice(0, numQuestions);
      
    } catch (err) {
      console.error('Error:', err);
      throw new Error(err.message || 'Error al generar el quiz. Intenta de nuevo.');
  }
};

// Función para generar una guía de estudio con IA
const generateGuideWithAI = async (topicInput, difficulty) => {
  try {
    setError('');
    setIsGeneratingGuide(true);
    
    const difficultyPrompts = {
      facil: 'Explica los conceptos básicos de manera simple y directa, como si estuvieras enseñando a alguien que recién comienza a aprender sobre el tema. Incluye ejemplos sencillos y evita jerga técnica compleja sin explicación.',
      medio: 'Proporciona una explicación detallada del tema, asumiendo que la persona tiene un conocimiento básico. Incluye conceptos clave, ejemplos prácticos y aplicaciones del tema.',
      dificil: 'Ofrece un análisis en profundidad del tema, incluyendo conceptos avanzados, teorías y aplicaciones prácticas. Incluye ejemplos detallados y considera diferentes perspectivas o enfoques.',
      experto: 'Desarrolla una guía completa y detallada a nivel universitario o profesional. Incluye conceptos avanzados, investigación actual, estudios de caso y aplicaciones prácticas. No evites la terminología técnica, pero asegúrate de explicarla claramente.'
    };
    
    const prompt = `Crea una guía de estudio detallada sobre: "${topicInput}".

NIVEL DE DIFICULTAD: ${difficulty.toUpperCase()}
${difficultyPrompts[difficulty]}

La guía debe estar bien estructurada con secciones claras y debe incluir:
1. Una introducción al tema
2. Conceptos clave
3. Ejemplos prácticos
4. Aplicaciones en el mundo real
5. Recursos adicionales para seguir aprendiendo

Formato de respuesta:
- Usa títulos en negrita para las secciones principales
- Usa viñetas para listas
- Incluye ejemplos claros
- Usa un lenguaje claro y conciso
- La extensión debe ser de aproximadamente 1000-1500 palabras`;

    const response = await fetch('http://localhost:3001/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        apiKey: API_KEY
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', response.status, errorData);
      throw new Error(errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Procesar respuesta
    let content = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content;
    } else if (Array.isArray(data) && data.length > 0) {
      content = data[0].generated_text || data[0];
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (typeof data === 'string') {
      content = data;
    }
    
    return {
      topic: topicInput,
      difficulty: difficulty,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    
  } catch (err) {
    console.error('Error generating guide:', err);
    throw new Error(err.message || 'Error al generar la guía. Intenta de nuevo.');
  } finally {
    setIsGeneratingGuide(false);
  }
};

// Manejador para generar una guía de estudio
const handleGenerateGuide = async () => {
  if (!topic.trim()) return;
  
  try {
    setScreen('guide_loading');
    const generatedGuide = await generateGuideWithAI(topic, difficulty);
    setGuide(generatedGuide);
    setScreen('guide');
  } catch (err) {
    setError(err.message);
    setScreen('input');
  }
};

// Manejador para volver al menú principal
const handleBackToMenu = () => {
  setScreen('input');
  setError('');
};

  const handleStartQuiz = async (quizData = null, sourceInfo = null) => {
    if (quizData) {
      // Quiz desde archivo
      setQuestions(quizData);
      setUserAnswers([]);
      setScreen('quiz');
      setCurrentQuestion(0);
      setScore(0);
      setLives(3);
      setStreak(0);
      setTopic(sourceInfo?.fileName || 'Archivo de texto');
    } else if (topic.trim()) {
      // Quiz normal con IA
      setScreen('loading');
      try {
        const quiz = await generateQuizWithAI(topic);
        setQuestions(quiz);
        setUserAnswers([]);
        setScreen('quiz');
        setCurrentQuestion(0);
        setScore(0);
        setLives(3);
        setStreak(0);
      } catch (err) {
        setError(err.message);
        setScreen('input');
      }
    }
  };

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === questions[currentQuestion].correct;
    setUserAnswers([...userAnswers, { questionIndex: currentQuestion, answer: index, correct: isCorrect }]);
    
    if (isCorrect) {
      setScore(score + 100 + (streak * 10));
      setStreak(streak + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    } else {
      setLives(lives - 1);
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (lives === 0) {
      updateUserStats();
      setScreen('results');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      updateUserStats();
      setScreen('results');
    }
  };
  
  // Actualizar estadísticas del usuario
  const updateUserStats = () => {
    // Incluir la respuesta actual si existe
    const allAnswers = [...userAnswers];
    if (isAnswered && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestion].correct;
      allAnswers.push({ questionIndex: currentQuestion, answer: selectedAnswer, correct: isCorrect });
    }
    
    const correctAnswers = allAnswers.filter(a => a.correct).length;
    const totalQuestions = allAnswers.length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    // Guardar en historial (máximo 3 entradas)
    try {
      const entry = {
        timestamp: Date.now(),
        score: percentage,
        topic,
        difficulty,
        correctAnswers,
        totalQuestions: questions.length,
        questions: questions.map((q, idx) => {
          const ua = allAnswers.find(a => a.questionIndex === idx);
          const userIdx = ua ? ua.answer : null;
          return {
            question: q.question,
            userAnswer: userIdx !== null && userIdx !== undefined ? q.options[userIdx] : null,
            correctAnswer: q.options[q.correct]
          };
        })
      };
      
      const newHistory = [entry, ...quizHistory].slice(0, 3); // Solo 3 entradas
      setQuizHistory(newHistory);
      localStorage.setItem('quizHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving quiz history:', e);
    }
    
    // Verificar si es un nuevo día para la racha
    const today = new Date().toDateString();
    const lastDate = userStats.lastQuizDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let newStreak = userStats.dailyStreak;
    
    if (lastDate !== today) {
      // Si es un nuevo día
      if (lastDate === yesterdayStr) {
        // Si completó quiz ayer, incrementar racha
        newStreak = userStats.dailyStreak + 1;
      } else if (lastDate === null) {
        // Primera vez
        newStreak = 1;
      } else {
        // Se rompió la racha
        newStreak = 1;
      }
    }
    
    const updatedStats = {
      dailyStreak: newStreak,
      lastQuizDate: today,
      totalQuizzes: userStats.totalQuizzes + 1,
      totalCorrectAnswers: userStats.totalCorrectAnswers + correctAnswers,
      totalQuestions: userStats.totalQuestions + totalQuestions
    };
    
    setUserStats(updatedStats);
    localStorage.setItem('userStats', JSON.stringify(updatedStats));
  };

  // Calcular y agregar puntos solo una vez al entrar a la pantalla de resultados
  useEffect(() => {
    if (screen === 'results' && earnedPoints === 0) {
      const correctAnswers = userAnswers.filter(a => a.correct).length;
      const points = calculatePoints(difficulty, correctAnswers, questions.length);
      setEarnedPoints(points);
      if (points > 0) {
        addPoints(points, {
          topic,
          difficulty,
          correctAnswers,
          totalQuestions: questions.length
        });
      }
    }
  }, [screen]);

  const handleRestart = () => {
    setScreen('input');
    setTopic('');
    setDifficulty('medio');
    setNumQuestions(5);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setLives(3);
    setStreak(0);
    setError('');
    setUserAnswers([]);
    setEarnedPoints(0);
  };

const handleBackToInput = () => {
  setScreen('input');
  setError('');
};

  // Renderizar la pantalla de carga del quiz
  if (screen === 'loading') {
    return <LoadingScreen topic={topic} />;
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
            <div className="duo-progress-container">
              <div className="duo-progress-bar">
                <div className="duo-progress-fill" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la vista de la guía
  if (screen === 'guide' && guide) {
    return (
      <div className="guide-container">
        <GuideViewer guide={guide} onBack={handleBackToInput} />
      </div>
    );
  }

  // Renderizar pantalla de estudio desde archivo
  if (screen === 'study_from_file') {
    return (
      <StudyFromFile
        onBack={handleBackToInput}
        onStartQuiz={handleStartQuiz}
        onGenerateGuide={(guideData) => {
          setGuide({
            ...guideData,
            topic: guideData.originalFileName || 'Archivo de texto'
          });
          setScreen('guide');
        }}
        API_KEY={API_KEY}
        POINTS_BY_DIFFICULTY={POINTS_BY_DIFFICULTY}
      />
    );
  }

  // Renderizar el menú principal
  if (screen === 'input' || screen === 'guide_input') {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
        {/* Banner de bienvenida */}
        <div style={{
          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
          color: 'white',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto 2rem auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
          borderRadius: '16px',
          position: 'relative'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', fontWeight: '600' }}>¡Hola usuario!</h2>
          <p style={{ margin: '0 0 1rem 0', opacity: '0.9', fontSize: '1.1rem' }}>Bienvenido a tu plataforma de estudio</p>
          <button 
            onClick={toggleHistory}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              ':hover': {
                background: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            {showHistory ? (
              <>
                <XCircle size={16} /> Ocultar Historial
              </>
            ) : (
              <>
                <Clock size={16} /> Ver Historial
              </>
            )}
          </button>
        </div>

        {/* Mostrar el historial si está activo */}
        {showHistory && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto 2rem auto',
            padding: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <QuizHistory history={quizHistory} />
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <StatsCards 
          dailyStreak={safeStats.dailyStreak}
          accuracyPercentage={safeStats.accuracyPercentage}
          totalQuizzes={safeStats.totalQuizzes}
        />

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          width: '100%',
          boxSizing: 'border-box'
        }}>

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

        <div className="cards-container" style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Tarjeta de Quiz */}
          <div className="duo-card" style={{
            flex: '1',
            minWidth: '400px',
            maxWidth: '500px',
            opacity: screen === 'input' ? 1 : 0.7,
            transition: 'all 0.3s ease',
            ':hover': {
              opacity: 1,
              transform: screen === 'input' ? 'translateY(-5px)' : 'none',
              boxShadow: screen === 'input' ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)'
            },
            position: 'relative',
            cursor: screen === 'input' ? 'default' : 'pointer'
          }} onClick={() => screen !== 'input' && setScreen('input')}>
            <div className="duo-header">
              <div className="duo-avatar duo-avatar-purple">
                <Sparkles className="duo-avatar-icon" />
              </div>
              <h1 className="duo-title">Modo Quiz</h1>
              <p className="duo-subtitle">Pon a prueba tus conocimientos</p>
            </div>
            
            <div className="duo-input-group">
              <label className="duo-label">
                ¿Sobre qué tema quieres aprender?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
                placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Python..."
                className="duo-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="duo-input-group">
              <label className="duo-label">
                🎯 Dificultad
              </label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="duo-input"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="facil">😊 Fácil - Para principiantes</option>
                <option value="medio">🧠 Medio - Nivel intermedio</option>
                <option value="dificil">🔥 Difícil - Desafiante</option>
                <option value="experto">💎 Experto - Muy avanzado</option>
              </select>
            </div>

            <div className="duo-input-group">
              <label className="duo-label">
                📊 Cantidad de preguntas
              </label>
              <select 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="duo-input"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="3">3 preguntas - Rápido</option>
                <option value="5">5 preguntas - Normal</option>
                <option value="10">10 preguntas - Completo</option>
                <option value="15">15 preguntas - Extenso</option>
                <option value="20">20 preguntas - Maratón</option>
              </select>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              color: 'white'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} />
                Puntos por completar al 100%:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>😊 Fácil: {POINTS_BY_DIFFICULTY.facil} pts</div>
                <div>🧠 Medio: {POINTS_BY_DIFFICULTY.medio} pts</div>
                <div>🔥 Difícil: {POINTS_BY_DIFFICULTY.dificil} pts</div>
                <div>💎 Experto: {POINTS_BY_DIFFICULTY.experto} pts</div>
              </div>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                * Puntos parciales si aciertas más del 50%
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartQuiz();
              }}
              disabled={!topic.trim()}
              className="duo-btn duo-btn-success"
              style={{ width: '100%' }}
            >
              Generar Quiz con IA
            </button>
            
            <div className="duo-tip">
              💡 Ideal para evaluar tu conocimiento con preguntas
            </div>
          </div>

          {/* Tarjeta de Guía de Estudio */}
          <div className="duo-card" style={{
            flex: '1',
            minWidth: '400px',
            maxWidth: '500px',
            opacity: screen === 'guide_input' ? 1 : 0.7,
            transition: 'all 0.3s ease',
            ':hover': {
              opacity: 1,
              transform: screen === 'guide_input' ? 'translateY(-5px)' : 'none',
              boxShadow: screen === 'guide_input' ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)'
            },
            position: 'relative',
            cursor: screen === 'guide_input' ? 'default' : 'pointer'
          }} onClick={() => screen !== 'guide_input' && setScreen('guide_input')}>
            <div className="duo-header">
              <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>
                <BookOpen className="duo-avatar-icon" />
              </div>
              <h1 className="duo-title">Guía de Estudio</h1>
              <p className="duo-subtitle">Aprende con guías personalizadas</p>
            </div>
            
            <div className="duo-input-group">
              <label className="duo-label">
                ¿Sobre qué tema necesitas una guía?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && topic.trim() && handleGenerateGuide()}
                placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Python..."
                className="duo-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="duo-input-group">
              <label className="duo-label">
                🎯 Nivel de conocimiento
              </label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="duo-input"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="facil">😊 Principiante - Conceptos básicos</option>
                <option value="medio">🧠 Intermedio - Conocimiento general</option>
                <option value="dificil">🔥 Avanzado - Profundización</option>
                <option value="experto">💎 Experto - Nivel universitario</option>
              </select>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              color: 'white'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} />
                Lo que incluye tu guía:
              </div>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Explicaciones claras y detalladas</li>
                <li>Conceptos clave y ejemplos</li>
                <li>Estructura organizada por temas</li>
                <li>Contenido adaptado a tu nivel</li>
              </ul>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                * La guía se generará con IA según el tema que elijas
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGenerateGuide();
              }}
              disabled={!topic.trim()}
              className="duo-btn"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                color: 'white',
                width: '100%',
                ':hover': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                }
              }}
            >
              {isGeneratingGuide ? (
                <>
                  <span className="duo-loading-spinner" style={{ marginRight: '8px' }}></span>
                  Generando guía...
                </>
              ) : (
                'Generar Guía de Estudio'
              )}
            </button>
            
            <div className="duo-tip">
              💡 Perfecto para aprender un tema desde cero o profundizar
            </div>
          </div>

          {/* Tarjeta de Estudio desde Archivo */}
          <div className="duo-card" style={{
            flex: '1',
            minWidth: '400px',
            maxWidth: '500px',
            opacity: screen === 'study_from_file' ? 1 : 0.7,
            transition: 'all 0.3s ease',
            ':hover': {
              opacity: 1,
              transform: screen === 'study_from_file' ? 'translateY(-5px)' : 'none',
              boxShadow: screen === 'study_from_file' ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)'
            },
            position: 'relative',
            cursor: screen === 'study_from_file' ? 'default' : 'pointer'
          }} onClick={() => screen !== 'study_from_file' && setScreen('study_from_file')}>
            <div className="duo-header">
              <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <FileText className="duo-avatar-icon" />
              </div>
              <h1 className="duo-title">Estudiar desde Archivo</h1>
              <p className="duo-subtitle">Sube tus apuntes y genera contenido personalizado</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              color: 'white'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                ¿Qué puedes hacer?
              </div>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Subir archivos de texto (.txt)</li>
                <li>Generar quizzes basados en tu contenido</li>
                <li>Crear guías de estudio personalizadas</li>
                <li>Extraer temas clave automáticamente</li>
              </ul>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
                * Máximo 1MB por archivo • Procesamiento inteligente con IA
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScreen('study_from_file');
              }}
              className="duo-btn"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                width: '100%',
                ':hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }
              }}
            >
              Subir Archivo de Texto
            </button>
            
            <div className="duo-tip">
              💡 Ideal para estudiar con tus propios apuntes y materiales
            </div>
          </div>
        </div>
        
        {error && (
          <div className="duo-alert duo-alert-error" style={{ marginTop: '2rem', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto' }}>
            ⚠️ {error}
          </div>
        )}
        </div>
      </div>
    );
  }

  if (screen === 'quiz' && questions.length > 0) {
    return (
      <QuizScreen
        questions={questions}
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        score={score}
        lives={lives}
        streak={streak}
        showCelebration={showCelebration}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
      />
    );
  }

  if (screen === 'results') {
    const correctAnswers = userAnswers.filter(a => a.correct).length;

    return (
      <ResultsScreen
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        topic={topic}
        difficulty={difficulty}
        earnedPoints={earnedPoints}
        totalPoints={totalPoints}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default App;