import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import Confetti from './Confetti';

const PointsCelebration = ({ points, isVisible, onComplete }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible && points > 0) {
      setShouldShow(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
        onComplete?.();
      }, 3000); // Increased duration to enjoy the confetti
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, points, onComplete]);

  if (!shouldShow) return null;

  return (
    <>
      <Confetti isActive={shouldShow} duration={3000} />
      <div className="points-celebration-overlay">
        <div className="points-celebration-content">
          <div className="points-celebration-icon">
            <Trophy size={48} />
            <Sparkles className="sparkle-icon" size={24} />
          </div>
          <div className="points-celebration-text">
            <h2>¡+{points} Puntos!</h2>
            <p>Excelente trabajo</p>
          </div>
          <div className="points-celebration-particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PointsCelebration;
