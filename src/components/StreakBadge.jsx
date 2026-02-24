import React from 'react';

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

export default StreakBadge;
