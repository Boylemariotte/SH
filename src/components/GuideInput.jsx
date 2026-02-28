import React from 'react';
import { BookOpen } from 'lucide-react';
import { APP_CONFIG, ANIMATION_CLASSES } from '../constants/appConfig';
import AppHeader from './AppHeader';
import TiltCard from './TiltCard';
import GuideInfoPanel from './GuideInfoPanel';

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
    <>
      <AppHeader 
        title="Guía de Estudio"
        subtitle="Aprende con guías personalizadas por IA"
        showStreakBadge={false}
      />
      <div className="mode-layout">
        <TiltCard className={`ss-card ${ANIMATION_CLASSES.card}`}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}
          
          <div className="form-group">
            <label className="form-label">¿Sobre qué tema necesitas una guía de estudio?</label>
            <input 
              type="text" 
              className="form-input" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && topic.trim() && onGenerateGuide()}
              placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Programación en Python..."
              disabled={isGenerating}
            />
          </div>

          <div className="form-group">
            <label className="form-label">🎯 Nivel de conocimiento</label>
            <div className="select-wrapper">
              <div className="select-dot" />
              <select 
                className="form-select has-dot" 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isGenerating}
              >
                <option value="facil">😊 Principiante - Conceptos básicos</option>
                <option value="medio">🧠 Intermedio - Conocimiento general</option>
                <option value="dificil">🔥 Avanzado - Profundización</option>
                <option value="experto">💎 Experto - Nivel universitario</option>
              </select>
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-shimmer" 
            onClick={onGenerateGuide}
            disabled={!topic.trim() || isGenerating}
            style={{ marginTop: '16px' }}
          >
            {isGenerating ? (
              <>
                <div className="loading-spinner" style={{ marginRight: '8px', width: '18px', height: '18px' }}></div>
                Generando guía...
              </>
            ) : (
              <>
                <BookOpen size={18} style={{ marginRight: '8px' }} />
                Generar Guía de Estudio
              </>
            )}
          </button>
          
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            background: 'var(--accent-light)', 
            border: '1px solid var(--border-hover)', 
            borderRadius: '8px', 
            fontSize: '0.9rem', 
            color: 'var(--text-muted)' 
          }}>
            💡 La IA creará una guía personalizada según el tema y nivel que elijas
          </div>
        </TiltCard>
        <TiltCard className={`${ANIMATION_CLASSES.rewards}`} style={{ width: '100%', maxWidth: '380px' }}>
          <GuideInfoPanel />
        </TiltCard>
      </div>
    </>
  );
};

export default React.memo(GuideInput);
