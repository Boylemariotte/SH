import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, History } from 'lucide-react';
import Card from './Card';

const QuizHistory = ({ history }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 border-surface-200 bg-transparent">
        <History size={48} className="mx-auto text-surface-300 mb-4" />
        <p className="text-surface-500 font-bold">No hay historial de quizzes aún.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
          <History size={20} />
        </div>
        <h3 className="text-2xl font-black text-surface-900">Historial Completo</h3>
      </div>

      <div className="grid gap-4">
        {history.map((quiz, index) => (
          <Card key={index} className="p-0 overflow-hidden border-white/60">
            <div
              className={`p-6 flex flex-wrap items-center justify-between gap-6 cursor-pointer transition-premium ${expandedIndex === index ? 'bg-surface-50' : 'hover:bg-surface-50/50'}`}
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${quiz.score >= 70 ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-amber/10 text-accent-amber'}`}>
                  {quiz.score}%
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 leading-tight">{quiz.topic}</h4>
                  <p className="text-xs text-surface-500 font-medium flex items-center gap-1.5 mt-1">
                    <Clock size={12} /> {formatDate(quiz.timestamp)} • <span className="capitalize">{quiz.difficulty}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">Puntaje</p>
                  <p className="text-sm font-bold text-surface-700">{quiz.correctAnswers} / {quiz.totalQuestions}</p>
                </div>
                <div className="text-surface-400 transition-premium">
                  {expandedIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="p-8 bg-white border-t border-surface-100 animate-slide-down">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-6">Revisión de Preguntas</h5>
                <div className="space-y-6">
                  {quiz.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-5 rounded-2xl bg-surface-50 border border-surface-100 space-y-4">
                      <p className="font-bold text-surface-900 leading-relaxed text-sm">{qIndex + 1}. {q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Tu elección</p>
                          <div className={`flex items-center gap-2 p-3 rounded-xl font-bold text-sm ${q.userAnswer === q.correctAnswer ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-rose/10 text-accent-rose'}`}>
                            {q.userAnswer || 'Sin respuesta'}
                            {q.userAnswer === q.correctAnswer ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </div>
                        </div>

                        {q.userAnswer !== q.correctAnswer && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Respuesta Correcta</p>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-emerald/10 text-accent-emerald font-bold text-sm text-surface-700">
                              {q.correctAnswer}
                              <CheckCircle size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
