import React from 'react';
import { Sparkles } from 'lucide-react';
import StreakBadge from './StreakBadge';
import AIRevealText from './AIRevealText';

const AppHeader = ({ 
  title, 
  subtitle, 
  showStreakBadge = false, 
  streakCount = 0,
  useDuoStyle = false,
  children 
}) => {
  if (useDuoStyle) {
    return (
      <div className="page-header animate-fade-in-up stagger-1">
        <div>
          <div className="duo-header">
            <div className="duo-avatar duo-avatar-purple">
              <Sparkles className="duo-avatar-icon" />
            </div>
            <h1 className="duo-title">{title}</h1>
            <p className="duo-subtitle">{subtitle}</p>
          </div>
          {children}
        </div>
        {showStreakBadge && <StreakBadge streak={streakCount} />}
      </div>
    );
  }

  return (
    <div className="page-header animate-fade-in-up stagger-1">
      <div>
        <h1 className="page-title">
          {typeof title === 'string' ? title : <AIRevealText text={title} />}
        </h1>
        <p className="page-subtitle">{subtitle}</p>
        {children}
      </div>
      {showStreakBadge && <StreakBadge streak={streakCount} />}
    </div>
  );
};

export default AppHeader;
