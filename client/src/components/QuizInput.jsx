import React from 'react';
import { Sparkles, Target, BarChart2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Input from './Input';

const QuizInput = ({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
  onStartQuiz,
  error
}) => {
  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      <Card className="p-8 md:p-10" hoverEffect={false}>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20 mx-auto mb-6">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-surface-50 tracking-tight transition-colors">
            Configura tu Quiz
          </h1>
          <p className="text-surface-500 dark:text-surface-400 font-medium mt-2 transition-colors">
            Personaliza tu experiencia de aprendizaje con IA.
          </p>
        </div>

        <div className="space-y-8">
          <Input
            label="¿Sobre qué tema quieres aprender?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Fotosíntesis, Segunda Guerra Mundial, Python..."
            icon={Sparkles}
            error={!!error}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} /> Dificultad
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-surface-200 dark:border-white/5 rounded-xl text-surface-900 dark:text-surface-50 focus:border-primary-500 transition-premium outline-none"
              >
                <option value="facil">😊 Fácil</option>
                <option value="medio">🧠 Medio</option>
                <option value="dificil">🔥 Difícil</option>
                <option value="experto">💎 Experto</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
                <BarChart2 size={16} /> Preguntas
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-surface-200 dark:border-white/5 rounded-xl text-surface-900 dark:text-surface-50 focus:border-primary-500 transition-premium outline-none"
              >
                <option value="3">3 rápidas</option>
                <option value="5">5 estándar</option>
                <option value="10">10 completas</option>
                <option value="15">15 extensas</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 animate-slide-up">
              <span>⚠️</span> {error}
            </div>
          )}

          <Button
            onClick={onStartQuiz}
            disabled={!topic.trim()}
            className="w-full py-5 text-xl mt-4"
            icon={Sparkles}
          >
            Generar Quiz con IA
          </Button>

          <p className="text-center text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-tighter opacity-70">
            💡 Consejo: Cuanto más específico seas, mejor será el contenido.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(QuizInput);
