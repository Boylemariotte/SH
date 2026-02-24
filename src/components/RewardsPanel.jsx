import React from 'react';
import { Award } from 'lucide-react';

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

export default RewardsPanel;
