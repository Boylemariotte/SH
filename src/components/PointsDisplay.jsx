import React from 'react';
import { Award, TrendingUp } from 'lucide-react';

const PointsDisplay = ({ totalPoints, earnedPoints = 0, showAnimation = false }) => {
  return (
    <div className="points-display">
      <div className="points-total">
        <Award size={20} className="points-icon" />
        <span className="points-number">{totalPoints}</span>
        <span className="points-label">pts</span>
      </div>
      
      {earnedPoints > 0 && showAnimation && (
        <div className="points-earned animate-fade-in-up">
          <TrendingUp size={16} className="points-trend-icon" />
          <span className="points-earned-text">+{earnedPoints}</span>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;
