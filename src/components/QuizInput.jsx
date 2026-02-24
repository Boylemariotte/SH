import React from 'react';
import { Sparkles } from 'lucide-react';

const QuizInput = ({ 
  topic, 
  setTopic, 
  difficulty, 
  setDifficulty, 
  numQuestions, 
  setNumQuestions, 
  onStartQuiz, 
  error 
}) => {
  return (
    <div className="duo-container">
      <div className="duo-card">
        <div className="duo-header">
          <div className="duo-avatar duo-avatar-purple">
            <Sparkles className="duo-avatar-icon" />
          </div>
          <h1 className="duo-title">StudyHelper AI</h1>
          <p className="duo-subtitle">Aprende Estudiando con IA</p>
        </div>
        
        {error && (
          <div className="duo-alert duo-alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}
        
        <div className="duo-input-group">
          <label htmlFor="topic-input" className="duo-label">
            ¿Sobre qué tema quieres aprender?
          </label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && topic.trim() && onStartQuiz()}
            placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Python..."
            className="duo-input"
            aria-required="true"
          />
        </div>

        <div className="duo-input-group">
          <label htmlFor="difficulty-select" className="duo-label">
            🎯 Dificultad
          </label>
          <select 
            id="difficulty-select"
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="duo-input"
          >
            <option value="facil">😊 Fácil - Para principiantes</option>
            <option value="medio">🧠 Medio - Nivel intermedio</option>
            <option value="dificil">🔥 Difícil - Desafiante</option>
            <option value="experto">💎 Experto - Muy avanzado</option>
          </select>
        </div>

        <div className="duo-input-group">
          <label htmlFor="num-questions-select" className="duo-label">
            📊 Cantidad de preguntas
          </label>
          <select 
            id="num-questions-select"
            value={numQuestions} 
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="duo-input"
          >
            <option value="3">3 preguntas - Rápido</option>
            <option value="5">5 preguntas - Normal</option>
            <option value="10">10 preguntas - Completo</option>
            <option value="15">15 preguntas - Extenso</option>
            <option value="20">20 preguntas - Maratón</option>
          </select>
        </div>
        
        <button
          onClick={onStartQuiz}
          disabled={!topic.trim()}
          className="duo-btn duo-btn-success"
          aria-label="Generar quiz con inteligencia artificial"
        >
          Generar Quiz con IA
        </button>
        
        <div className="duo-tip">
          💡 Consejo: Sé específico con el tema para mejores preguntas
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuizInput);
