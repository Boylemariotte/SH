import React from 'react';
import { BookOpen, Clock, Target, Sparkles } from 'lucide-react';

function GuideInfoPanel() {
  return (
    <div className="rewards-card">
      <div className="rewards-title">
        <BookOpen size={18} /> Guías de Estudio
      </div>
      
      <div className="rewards-row">
        <span className="rewards-difficulty">📚 Contenido</span>
        <span className="rewards-pts">1000-1500 palabras</span>
      </div>
      
      <div className="rewards-row">
        <span className="rewards-difficulty">🎯 Estructura</span>
        <span className="rewards-pts">5 secciones</span>
      </div>
      
      <div className="rewards-row">
        <span className="rewards-difficulty">⏱️ Tiempo</span>
        <span className="rewards-pts">15-20 min lectura</span>
      </div>
      
      <div className="rewards-row">
        <span className="rewards-difficulty">🔍 Niveles</span>
        <span className="rewards-pts">4 dificultades</span>
      </div>
      
      <p className="rewards-note" style={{ marginTop: '1rem' }}>
        * Las guías se generan con IA y se adaptan a tu nivel de conocimiento
      </p>
    </div>
  );
}

export default GuideInfoPanel;
