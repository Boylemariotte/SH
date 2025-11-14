import React from 'react';
import { BookOpen } from 'lucide-react';

const GuideInput = ({ 
  topic, 
  setTopic, 
  difficulty, 
  setDifficulty, 
  onGenerateGuide,
  error,
  isGenerating
}) => {
  return (
    <div className="duo-container">
      <div className="duo-card">
        <div className="duo-header">
          <div className="duo-avatar duo-avatar-blue">
            <BookOpen className="duo-avatar-icon" />
          </div>
          <h1 className="duo-title">Guía de Estudio</h1>
          <p className="duo-subtitle">Aprende con guías personalizadas por IA</p>
        </div>
        
        {error && (
          <div className="duo-alert duo-alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}
        
        <div className="duo-input-group">
          <label htmlFor="topic-input" className="duo-label">
            ¿Sobre qué tema necesitas una guía de estudio?
          </label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && topic.trim() && onGenerateGuide()}
            placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Programación en Python..."
            className="duo-input"
            aria-required="true"
            disabled={isGenerating}
          />
        </div>

        <div className="duo-input-group">
          <label htmlFor="difficulty-select" className="duo-label">
            🎯 Nivel de conocimiento
          </label>
          <select 
            id="difficulty-select"
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="duo-input"
            disabled={isGenerating}
          >
            <option value="facil">😊 Principiante - Conceptos básicos</option>
            <option value="medio">🧠 Intermedio - Conocimiento general</option>
            <option value="dificil">🔥 Avanzado - Profundización</option>
            <option value="experto">💎 Experto - Nivel universitario</option>
          </select>
        </div>
        
        <button
          onClick={onGenerateGuide}
          disabled={!topic.trim() || isGenerating}
          className="duo-btn duo-btn-primary"
          style={{ marginTop: '16px' }}
        >
          {isGenerating ? (
            <>
              <span className="duo-loading-spinner" style={{ marginRight: '8px' }}></span>
              Generando guía...
            </>
          ) : (
            'Generar Guía de Estudio'
          )}
        </button>
        
        <div className="duo-tip">
          💡 La IA creará una guía personalizada según el tema y nivel que elijas
        </div>
      </div>
    </div>
  );
};

export default React.memo(GuideInput);
