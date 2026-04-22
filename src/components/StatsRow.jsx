import React from 'react';
import { Flame, Target, BookOpen } from 'lucide-react';
import TiltCard from './TiltCard';

function StatsRow({ dailyStreak, accuracyPercentage, totalQuizzes }) {
  return (
    <div className="stats-row">
      <TiltCard className="stat-card">
        <Flame size={24} className="stat-icon" />
        <span className="stat-value">{dailyStreak}</span>
        <span className="stat-label">Racha de días</span>
      </TiltCard>
      <TiltCard className="stat-card">
        <Target size={24} className="stat-icon" />
        <span className="stat-value">{accuracyPercentage}%</span>
        <span className="stat-label">Aciertos</span>
      </TiltCard>
      <TiltCard className="stat-card">
        <BookOpen size={24} className="stat-icon" />
        <span className="stat-value">{totalQuizzes}</span>
        <span className="stat-label">Quizzes</span>
      </TiltCard>
    </div>
  );
}

export default StatsRow;
