import React, { useState, useEffect } from 'react';
import { Heart, Star, Trophy, Sparkles, CheckCircle, XCircle, Zap, Loader, Award, BookOpen, Clock, ChevronLeft, FileText, BarChart2, Settings, LogOut, AlertTriangle, ArrowRight } from 'lucide-react';
import TiltCard from './components/TiltCard';
import { usePoints } from './hooks/usePoints';
import LandingPage from './components/LandingPage';
import GuideViewer from './components/GuideViewer';
import QuizHistory from './components/QuizHistory';
import StudyFromFile from './components/StudyFromFile';
import './styles/guideStyles.css';
import './styles/quizHistory.css';
import './styles/FileUpload.css';

// URL dinámica de la API
const getApiUrl = () => {
  if (import.meta.env.PROD) return '';
  return 'http://localhost:3001';
};

const getApiKey = () => {
  if (import.meta.env.PROD) return null;
  return import.meta.env.VITE_GROQ_API_KEY;
};

// ─── Sidebar ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'input', label: 'Modo Quiz', icon: <Sparkles size={20} /> },
  { id: 'guide_input', label: 'Guía de Estudio', icon: <BookOpen size={20} /> },
  { id: 'study_from_file', label: 'Subir Archivo', icon: <FileText size={20} /> },
  { id: 'stats', label: 'Estadísticas', icon: <BarChart2 size={20} /> },
];

function Sidebar({ screen, onNavigate, totalPoints, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">StudySmart AI</span>
        <div className="sidebar-logo-icon"><Settings size={20} /></div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${screen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-points">
          <Award size={20} />
          <span>{totalPoints} pts</span>
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Skeletons ─────────────────────────────────────────────────────────────
function QuizSkeleton() {
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="skeleton-base skeleton-title" style={{ width: '40%', margin: '0 auto 1rem' }} />
        <div className="skeleton-base skeleton-text" style={{ width: '20%', margin: '0 auto' }} />
      </div>
      <div className="quiz-card">
        <div className="skeleton-base skeleton-text" style={{ height: '1.5rem', width: '80%', marginBottom: '2rem' }} />
        <div className="options-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-base skeleton-option" />
          ))}
        </div>
      </div>
    </div>
  );
}

function GuideSkeleton() {
  return (
    <div className="guide-layout">
      <div className="guide-nav-card shadow-sm">
        <div className="skeleton-base skeleton-text" style={{ height: '1.2rem', marginBottom: '1.5rem' }} />
        <div className="skeleton-base skeleton-text" style={{ width: '70%' }} />
        <div className="skeleton-base skeleton-text" style={{ width: '50%' }} />
        <div className="skeleton-base skeleton-text" style={{ width: '60%' }} />
      </div>
      <div className="guide-content-area shadow-sm">
        <div className="skeleton-base skeleton-title" />
        <div className="skeleton-base skeleton-text" />
        <div className="skeleton-base skeleton-text" />
        <div className="skeleton-base skeleton-text" style={{ width: '80%' }} />
        <div className="skeleton-base skeleton-text" style={{ width: '40%', marginTop: '2rem' }} />
        <div className="skeleton-base skeleton-text" />
        <div className="skeleton-base skeleton-text" style={{ width: '90%' }} />
      </div>
    </div>
  );
}

// ─── Logout Modal ───────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon"><AlertTriangle size={32} color="#f59e0b" /></div>
        <h2 className="modal-title">¿Cerrar sesión?</h2>
        <p className="modal-desc">
          Se eliminarán tu historial, estadísticas y puntos guardados localmente.
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Sí, cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

// ─── Streak Badge ───────────────────────────────────────────────────────────
function StreakBadge({ streak }) {
  return (
    <div className="streak-badge">
      <div className="streak-badge-icon">⚡</div>
      <div className="streak-badge-info">
        <span className="streak-badge-label">Racha</span>
        <span className="streak-badge-value">{streak} días</span>
      </div>
    </div>
  );
}

// ─── Rewards Panel ──────────────────────────────────────────────────────────
function RewardsPanel({ POINTS_BY_DIFFICULTY }) {
  return (
    <div className="rewards-card">
      <div className="rewards-title">
        <Award size={18} /> Sistema de Recompensas
      </div>
      {[
        { key: 'facil', label: 'Fácil' },
        { key: 'medio', label: 'Medio' },
        { key: 'dificil', label: 'Difícil' },
        { key: 'experto', label: 'Experto' },
      ].map(d => (
        <div className="rewards-row" key={d.key}>
          <span className="rewards-difficulty">{d.label}</span>
          <span className="rewards-pts">{POINTS_BY_DIFFICULTY[d.key]} pts</span>
        </div>
      ))}
      <p className="rewards-note">* Puntos parciales si aciertas más del 50%. ¡Sigue aprendiendo!</p>
    </div>
  );
}

// ─── Stats Cards Row ────────────────────────────────────────────────────────
function StatsRow({ dailyStreak, accuracyPercentage, totalQuizzes }) {
  return (
    <div className="stats-row">
      <TiltCard className="stat-card">
        <span className="stat-emoji">🔥</span>
        <span className="stat-value">{dailyStreak}</span>
        <span className="stat-label">Racha de días</span>
      </TiltCard>
      <TiltCard className="stat-card">
        <span className="stat-emoji">🎯</span>
        <span className="stat-value">{accuracyPercentage}%</span>
        <span className="stat-label">Aciertos</span>
      </TiltCard>
      <TiltCard className="stat-card">
        <span className="stat-emoji">📚</span>
        <span className="stat-value">{totalQuizzes}</span>
        <span className="stat-label">Quizzes</span>
      </TiltCard>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
function App() {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const [screen, setScreen] = useState('input');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const [guide, setGuide] = useState(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { totalPoints, calculatePoints, addPoints, POINTS_BY_DIFFICULTY } = usePoints();

  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      dailyStreak: 0, lastQuizDate: null,
      totalQuizzes: 0, totalCorrectAnswers: 0, totalQuestions: 0
    };
  });

  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('quizHistory');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const accuracyPercentage = userStats.totalQuestions > 0
    ? Math.round((userStats.totalCorrectAnswers / userStats.totalQuestions) * 100) : 0;

  const safeStats = {
    dailyStreak: userStats.dailyStreak || 0,
    totalQuizzes: userStats.totalQuizzes || 0,
    accuracyPercentage: isNaN(accuracyPercentage) ? 0 : accuracyPercentage
  };

  // ── AI helpers ─────────────────────────────────────────────────────────
  const generateQuizWithAI = async (topicInput) => {
    const difficultyPrompts = {
      facil: 'Las preguntas deben ser básicas y para principiantes.',
      medio: 'Las preguntas deben ser de nivel intermedio.',
      dificil: 'Las preguntas deben ser avanzadas y desafiantes.',
      experto: 'Las preguntas deben ser de nivel experto.'
    };
    const prompt = `Genera exactamente ${numQuestions} preguntas de opción múltiple sobre: "${topicInput}".
NIVEL: ${difficulty.toUpperCase()}
${difficultyPrompts[difficulty]}
Responde ÚNICAMENTE con un array JSON válido:
[{"question":"...","options":["A","B","C","D"],"correct":0}]
El campo "correct" es el índice de la respuesta correcta (0-3). En español.`;

    console.log(`Solicitando quiz sobre: ${topicInput}...`);

    try {
      const response = await fetch(`${getApiUrl()}/api/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(getApiKey() && { apiKey: getApiKey() }) })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Error en respuesta API:', err);
        throw new Error(err.error || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos de la API:', data);

      let content = data.choices?.[0]?.message?.content ?? data.generated_text ?? (typeof data === 'string' ? data : '');
      const match = content.match(/\[[\s\S]*\]/);

      if (!match) {
        console.error('Contenido de IA no válido:', content);
        throw new Error('La IA no generó el formato correcto.');
      }

      const parsed = JSON.parse(match[0]);
      const valid = parsed.filter(q => q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correct === 'number');

      if (!valid.length) {
        console.error('Preguntas filtradas no válidas:', parsed);
        throw new Error('Preguntas con formato incorrecto.');
      }

      return valid.slice(0, numQuestions);
    } catch (err) {
      console.error('Error en generateQuizWithAI:', err);
      throw err;
    }
  };

  const generateGuideWithAI = async (topicInput, diff) => {
    setIsGeneratingGuide(true);
    try {
      const prompt = `Crea una guía de estudio detallada en español sobre: "${topicInput}".
Nivel: ${diff.toUpperCase()}. 
Incluye: introducción, conceptos clave, ejemplos prácticos, aplicaciones reales, recursos adicionales.
Usa títulos en negrita, viñetas y lenguaje claro. ~1000-1500 palabras.`;

      const response = await fetch(`${getApiUrl()}/api/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(getApiKey() && { apiKey: getApiKey() }) })
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.error || `Error ${response.status}`); }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? data.generated_text ?? '';
      return { topic: topicInput, difficulty: diff, content: content.trim(), createdAt: new Date().toISOString() };
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleStartQuiz = async (quizData = null, sourceInfo = null) => {
    setError('');

    // Si quizData es un array, viene de un archivo pre-procesado
    if (Array.isArray(quizData)) {
      setQuestions(quizData);
      setUserAnswers([]); setScreen('quiz');
      setCurrentQuestion(0); setScore(0); setLives(3); setStreak(0);
      setTopic(sourceInfo?.fileName || 'Archivo');
      return;
    }
    if (!topic.trim()) return;
    setScreen('loading');
    try {
      const quiz = await generateQuizWithAI(topic);
      setQuestions(quiz); setUserAnswers([]); setScreen('quiz');
      setCurrentQuestion(0); setScore(0); setLives(3); setStreak(0);
    } catch (err) {
      setError(err.message); setScreen('input');
    }
  };

  const handleGenerateGuide = async () => {
    if (!topic.trim()) return;
    setError('');
    try {
      setScreen('guide_loading');
      const g = await generateGuideWithAI(topic, difficulty);
      setGuide(g); setScreen('guide');
    } catch (err) {
      setError(err.message); setScreen('guide_input');
    }
  };

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === questions[currentQuestion].correct;
    setUserAnswers([...userAnswers, { questionIndex: currentQuestion, answer: index, correct: isCorrect }]);
    if (isCorrect) {
      setScore(score + 100 + streak * 10);
      setStreak(streak + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    } else {
      setLives(lives - 1);
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1 && lives > 0) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const correctOnes = userAnswers.filter(a => a.correct).length;
    const finalEarned = calculatePoints(correctOnes, questions.length, difficulty);
    setEarnedPoints(finalEarned);
    addPoints(finalEarned, `Quiz: ${topic}`);

    const newStats = {
      ...userStats,
      totalQuizzes: userStats.totalQuizzes + 1,
      totalCorrectAnswers: userStats.totalCorrectAnswers + correctOnes,
      totalQuestions: userStats.totalQuestions + questions.length,
      lastQuizDate: new Date().toISOString()
    };
    setUserStats(newStats);
    localStorage.setItem('userStats', JSON.stringify(newStats));

    const historyItem = {
      topic, difficulty, score: correctOnes, total: questions.length,
      date: new Date().toISOString(), points: finalEarned
    };
    const newHistory = [historyItem, ...quizHistory].slice(0, 50);
    setQuizHistory(newHistory);
    localStorage.setItem('quizHistory', JSON.stringify(newHistory));

    setScreen('results');
  };

  const handleRestart = () => {
    setScreen('input'); setTopic(''); setDifficulty('medio'); setNumQuestions(5);
    setQuestions([]); setCurrentQuestion(0); setSelectedAnswer(null);
    setIsAnswered(false); setScore(0); setLives(3); setStreak(0);
    setError(''); setUserAnswers([]); setEarnedPoints(0);
  };

  const handleNavigate = (id) => {
    setError('');
    if (id === 'input' || id === 'guide_input' || id === 'stats' || id === 'study_from_file') {
      setScreen(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userStats');
    localStorage.removeItem('quizHistory');
    localStorage.removeItem('userPoints');
    localStorage.removeItem('pointsHistory');
    setUserStats({ dailyStreak: 0, lastQuizDate: null, totalQuizzes: 0, totalCorrectAnswers: 0, totalQuestions: 0 });
    setQuizHistory([]);
    setScreen('input');
    setTopic('');
    setDifficulty('medio');
    setNumQuestions(5);
    setQuestions([]);
    setScore(0); setLives(3); setStreak(0);
    setError(''); setUserAnswers([]); setEarnedPoints(0);
    setGuide(null);
    setShowLogoutModal(false);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  const handleGetStarted = () => {
    setIsLoggedIn(true);
  };

  // ── Render Helpers ───────────────────────────────────────────────────────
  const renderMainContent = () => {
    // 1. Loading
    if (screen === 'loading') {
      return (
        <div style={{ position: 'relative' }}>
          <div className="skeleton-overlay">
            <div className="loading-card shadow-lg" style={{ width: '400px' }}>
              <div className="loading-spinner"><Loader size={32} className="animate-spin" /></div>
              <h2 className="loading-title" style={{ fontSize: '1.25rem' }}>Generando Quiz...</h2>
              <p className="loading-text" style={{ fontSize: '0.9rem' }}>La IA está analizando <strong style={{ color: '#a78bfa' }}>{topic}</strong></p>
            </div>
          </div>
          <QuizSkeleton />
        </div>
      );
    }

    if (screen === 'guide_loading') {
      return (
        <div style={{ position: 'relative' }}>
          <div className="skeleton-overlay">
            <div className="loading-card shadow-lg" style={{ width: '400px' }}>
              <div className="loading-spinner"><Loader size={32} className="animate-spin" /></div>
              <h2 className="loading-title" style={{ fontSize: '1.25rem' }}>Creando Guía...</h2>
              <p className="loading-text" style={{ fontSize: '0.9rem' }}>La IA está estructurando contenido</p>
            </div>
          </div>
          <GuideSkeleton />
        </div>
      );
    }

    // 2. Guide
    if (screen === 'guide' && guide) {
      return <GuideViewer guide={guide} onBack={() => setScreen('guide_input')} />;
    }

    // 3. Quiz
    if (screen === 'quiz' && questions.length > 0) {
      const q = questions[currentQuestion];
      const progress = ((currentQuestion) / questions.length) * 100;
      return (
        <div className="quiz-shell" style={{ padding: 0, minHeight: 'auto' }}>
          <div className="quiz-top-bar">
            <div className="quiz-stats-row">
              <div className="quiz-score-display">
                <Star size={20} color="#f59e0b" fill="#f59e0b" />
                <span>{score}</span>
                {streak > 1 && <span className="quiz-streak-pill">🔥 ×{streak}</span>}
              </div>
              <div className="quiz-hearts">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} size={22} className="quiz-heart"
                    color={i < lives ? '#ef4444' : '#2d2b3a'}
                    fill={i < lives ? '#ef4444' : 'none'} />
                ))}
              </div>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="quiz-progress-text">Pregunta {currentQuestion + 1} de {questions.length}</div>
          </div>

          <div className="quiz-question-card">
            <div className="quiz-q-number">Pregunta {currentQuestion + 1}</div>
            <p className="quiz-q-text">{q.question}</p>
            <div className="quiz-options">
              {q.options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (isAnswered) {
                  if (idx === q.correct) cls += ' quiz-option-correct';
                  else if (idx === selectedAnswer) cls += ' quiz-option-incorrect';
                }
                return (
                  <button key={idx} className={cls} onClick={() => handleAnswerSelect(idx)} disabled={isAnswered}>
                    <span>{opt}</span>
                    {isAnswered && idx === q.correct && <CheckCircle size={18} color="#10b981" />}
                    {isAnswered && idx === selectedAnswer && idx !== q.correct && <XCircle size={18} color="#ef4444" />}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="quiz-next-btn">
                <button className="btn btn-primary" onClick={handleNext}>
                  {currentQuestion < questions.length - 1 && lives > 0 ? 'Siguiente →' : 'Ver Resultados'}
                </button>
              </div>
            )}
          </div>

          {showCelebration && (
            <div className="celebration-overlay">
              <div className="celebration-box">
                <div className="celebration-emoji">🎉</div>
                <div className="celebration-text">¡Correcto!</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 4. Results
    if (screen === 'results') {
      const correctAnswers = userAnswers.filter(a => a.correct).length;
      const pct = Math.round((correctAnswers / questions.length) * 100);
      return (
        <div className="loading-screen" style={{ minHeight: '60vh', padding: 0 }}>
          <div className="loading-card" style={{ maxWidth: 500 }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {pct >= 80 ? '🏆' : pct >= 50 ? '🎯' : '💪'}
            </div>
            <div className="results-score-big">{pct}%</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precisión</p>
            <div className="results-breakdown">
              <div className="results-item results-item-correct">
                <div className="results-num">{correctAnswers}</div>
                <div className="results-num-label">Correctas</div>
              </div>
              <div className="results-item results-item-incorrect">
                <div className="results-num">{questions.length - correctAnswers}</div>
                <div className="results-num-label">Incorrectas</div>
              </div>
            </div>
            {earnedPoints > 0 && (
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--border-hover)', borderRadius: 12, padding: '0.75rem', marginBottom: '1rem', color: 'var(--accent)', fontWeight: 700 }}>
                <Award size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                +{earnedPoints} puntos ganados
              </div>
            )}
            <button className="btn btn-primary" onClick={handleRestart}>Volver al inicio</button>
          </div>
        </div>
      );
    }

    // 5. File Upload
    if (screen === 'study_from_file') {
      return (
        <StudyFromFile
          onBack={() => setScreen('input')}
          onStartQuiz={handleStartQuiz}
          onGenerateGuide={(gd) => { setGuide({ ...gd, topic: gd.originalFileName || 'Archivo' }); setScreen('guide'); }}
          API_KEY={API_KEY}
          POINTS_BY_DIFFICULTY={POINTS_BY_DIFFICULTY}
        />
      );
    }

    // 6. Stats
    if (screen === 'stats') {
      return (
        <>
          <div className="page-header animate-fade-in-up stagger-1">
            <div>
              <h1 className="page-title">Tu Progreso</h1>
              <p className="page-subtitle">Visualiza tu historial de aprendizaje y logros.</p>
            </div>
            <StreakBadge streak={safeStats.dailyStreak} />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <StatsRow dailyStreak={safeStats.dailyStreak} accuracyPercentage={safeStats.accuracyPercentage} totalQuizzes={safeStats.totalQuizzes} />
          </div>
          <div className="ss-card animate-fade-in-up stagger-3">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Historial de Actividad</h2>
            <QuizHistory history={quizHistory} />
          </div>
        </>
      );
    }

    // 7. Input (Modo Quiz)
    if (screen === 'guide_input') {
      return (
        <>
          <div className="page-header animate-fade-in-up stagger-1">
            <div>
              <h1 className="page-title">Guía de Estudio</h1>
              <p className="page-subtitle">Genera contenido personalizado con IA sobre cualquier tema.</p>
            </div>
            <StreakBadge streak={safeStats.dailyStreak} />
          </div>
          <div className="mode-layout">
            <TiltCard className="ss-card animate-fade-in-up stagger-2">
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              <div className="form-group">
                <label className="form-label">¿Sobre qué tema necesitas una guía?</label>
                <input type="text" className="form-input" value={topic} onChange={e => setTopic(e.target.value)} onKeyPress={e => e.key === 'Enter' && topic.trim() && handleGenerateGuide()} placeholder="Ej: Fotosíntesis, Revolución Francesa, Python..." />
              </div>
              <div className="form-group">
                <label className="form-label">Nivel de conocimiento</label>
                <div className="select-wrapper">
                  <select className="form-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="facil">😊 Principiante</option>
                    <option value="medio">🧠 Intermedio</option>
                    <option value="dificil">🔥 Avanzado</option>
                    <option value="experto">💎 Experto</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-blue btn-shimmer" onClick={handleGenerateGuide} disabled={!topic.trim() || isGeneratingGuide}>
                <BookOpen size={18} /> {isGeneratingGuide ? 'Generando guía...' : 'Generar Guía de Estudio'}
              </button>
            </TiltCard>
            <TiltCard className="rewards-card animate-fade-in-up stagger-3" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}>
              <div className="rewards-title"><BookOpen size={18} /> Tu guía incluirá:</div>
              {['Introducción y contexto', 'Conceptos clave explicados', 'Ejemplos prácticos', 'Aplicaciones en el mundo real', 'Recursos para seguir aprendiendo'].map((item, i) => (
                <div className="rewards-row" key={i}><span className="rewards-difficulty">{item}</span><span>✓</span></div>
              ))}
              <p className="rewards-note">* Guía generada con IA adaptada a tu nivel</p>
            </TiltCard>
          </div>
        </>
      );
    }

    // Default: Modo Quiz Input
    return (
      <>
        <div className="page-header animate-fade-in-up stagger-1">
          <div>
            <h1 className="page-title">¿Qué vamos a aprender hoy?</h1>
            <p className="page-subtitle">Configura tu quiz y desafía tus conocimientos con IA.</p>
          </div>
          <StreakBadge streak={safeStats.dailyStreak} />
        </div>
        <div className="mode-layout">
          <TiltCard className="ss-card animate-fade-in-up stagger-2">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <div className="form-group">
              <label className="form-label">¿Sobre qué tema quieres aprender?</label>
              <input type="text" className="form-input" value={topic} onChange={e => setTopic(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleStartQuiz()} placeholder="Ej: Fotosíntesis, Revolución Francesa, React..." />
            </div>
            <div className="selects-row">
              <div className="form-group">
                <label className="form-label">Nivel</label>
                <div className="select-wrapper">
                  <div className="select-dot" />
                  <select className="form-select has-dot" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="facil">Fácil</option>
                    <option value="medio">Intermedio</option>
                    <option value="dificil">Difícil</option>
                    <option value="experto">Experto</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preguntas</label>
                <div className="select-wrapper">
                  <select className="form-select" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}>
                    <option value="3">3 rápidas</option>
                    <option value="5">5 estándar</option>
                    <option value="10">10 completo</option>
                    <option value="15">15 extenso</option>
                    <option value="20">20 maratón</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-shimmer" onClick={() => handleStartQuiz()} disabled={!topic.trim()}>
              <Sparkles size={18} /> Generar Quiz con IA
            </button>
          </TiltCard>
          <TiltCard className="animate-fade-in-up stagger-3" style={{ width: '100%', maxWidth: '380px' }}>
            <RewardsPanel POINTS_BY_DIFFICULTY={POINTS_BY_DIFFICULTY} />
          </TiltCard>
        </div>
      </>
    );
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <div className="mouse-glow" />
        <LandingPage onGetStarted={handleGetStarted} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <div className="mouse-glow" />
      <Sidebar screen={screen} onNavigate={handleNavigate} totalPoints={totalPoints} onLogout={() => setShowLogoutModal(true)} />
      <main className="main-content">
        {renderMainContent()}
      </main>
      {showLogoutModal && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />}
    </div>
  );
}

export default App;