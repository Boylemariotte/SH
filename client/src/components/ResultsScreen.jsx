import React from 'react';
import { Trophy, Star, Award, RotateCcw, Sparkles } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const DIFFICULTY_LABELS = {
  facil: '😊 Fácil',
  medio: '🧠 Medio',
  dificil: '🔥 Difícil',
  experto: '💎 Experto'
};

const ResultsScreen = ({
  score,
  correctAnswers,
  totalQuestions,
  topic,
  difficulty,
  earnedPoints,
  totalPoints,
  onRestart
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = percentage >= 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      <Card className="relative overflow-hidden p-8 md:p-12" hoverEffect={false}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mx-auto mb-8 animate-pulse-soft ${passed ? 'bg-gradient-to-br from-accent-amber to-orange-600' : 'bg-gradient-to-br from-surface-400 to-surface-600 dark:from-zinc-600 dark:to-zinc-800'}`}>
              {passed ? <Trophy size={48} /> : <Star size={48} />}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-surface-50 tracking-tight transition-colors mb-4">
              {passed ? '¡Increíble Victoria! 🎉' : '¡Sigue Intentándolo! 💪'}
            </h1>
            <p className="text-xl text-surface-500 dark:text-surface-400 font-medium transition-colors">
              {passed ? 'Has demostrado maestría en este tema.' : 'Cada error es una oportunidad para aprender.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-surface-100 dark:border-white/5 text-center transition-colors">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest mb-2">Puntuación</p>
              <p className="text-4xl font-black text-primary-600 dark:text-primary-400">{score}</p>
              <p className="text-sm font-bold text-surface-500 mt-1 uppercase tracking-tighter opacity-70">puntos totales</p>
            </div>

            <div className="bg-surface-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-surface-100 dark:border-white/5 text-center transition-colors">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest mb-2">Precisión</p>
              <p className="text-4xl font-black text-secondary-600 dark:text-secondary-400">{percentage}%</p>
              <p className="text-sm font-bold text-surface-500 mt-1 uppercase tracking-tighter opacity-70">{correctAnswers} de {totalQuestions}</p>
            </div>

            <div className="bg-surface-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-surface-100 dark:border-white/5 text-center transition-colors">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest mb-2">Recompensa</p>
              <p className="text-4xl font-black text-accent-emerald">+{earnedPoints}</p>
              <p className="text-sm font-bold text-surface-500 mt-1 uppercase tracking-tighter opacity-70">puntos ganados</p>
            </div>
          </div>

          {/* Progress Card Highlights */}
          <div className="glass p-8 rounded-[2rem] border-primary-500/20 mb-12 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-primary-100 dark:border-white/5 flex items-center justify-center text-primary-600 shadow-sm">
                  <Award size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Total Acumulado</p>
                  <p className="text-3xl font-black text-surface-900 dark:text-surface-50">{totalPoints} <span className="text-sm uppercase opacity-40">pts</span></p>
                </div>
              </div>

              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-surface-500 dark:text-surface-400 mb-1">Dificultad: {DIFFICULTY_LABELS[difficulty]}</div>
                <div className="text-accent-amber font-black tracking-widest uppercase text-xs">Tema: {topic}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onRestart}
              className="flex-1 py-5 text-xl"
              icon={RotateCcw}
              variant="primary"
            >
              Nuevo Quiz
            </Button>
            <Button
              variant="ghost"
              className="px-8 py-5 text-surface-500"
              icon={Sparkles}
              onClick={() => window.location.href = '/'}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(ResultsScreen);
