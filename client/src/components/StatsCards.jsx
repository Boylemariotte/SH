import React from 'react';
import { Zap, Target, BookOpen } from 'lucide-react';
import Card from './Card';

const StatsCards = ({ dailyStreak, accuracyPercentage, totalQuizzes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mb-12">
      {/* Racha diaria */}
      <Card className="p-6 flex items-center gap-6" hoverEffect={true}>
        <div className="w-16 h-16 rounded-2xl bg-accent-amber/10 dark:bg-accent-amber/20 flex items-center justify-center text-accent-amber shadow-inner">
          <Zap size={32} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1 transition-colors">Racha Diaria</p>
          <p className="text-2xl font-black text-surface-900 dark:text-surface-50 transition-colors uppercase tracking-tight">{dailyStreak} días</p>
        </div>
      </Card>

      {/* Porcentaje de aciertos */}
      <Card className="p-6 flex items-center gap-6" hoverEffect={true}>
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner">
          <Target size={32} />
        </div>
        <div>
          <p className="text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1 transition-colors">Precisión</p>
          <p className="text-2xl font-black text-surface-900 dark:text-surface-50 transition-colors uppercase tracking-tight">{accuracyPercentage}%</p>
        </div>
      </Card>

      {/* Total de quizzes */}
      <Card className="p-6 flex items-center gap-6" hoverEffect={true}>
        <div className="w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-500/10 flex items-center justify-center text-secondary-600 dark:text-secondary-400 shadow-inner">
          <BookOpen size={32} />
        </div>
        <div>
          <p className="text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1 transition-colors">Completados</p>
          <p className="text-2xl font-black text-surface-900 dark:text-surface-50 transition-colors uppercase tracking-tight">{totalQuizzes} Quizzes</p>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
