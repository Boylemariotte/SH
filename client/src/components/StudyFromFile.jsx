import React, { useState } from 'react';
import { FileText, BookOpen, Sparkles, ArrowLeft, AlertCircle, CheckCircle, FileUp, Zap, Target } from 'lucide-react';
import FileUpload from './FileUpload';
import { useFileProcessor } from '../hooks/useFileProcessor';
import Card from './Card';
import Button from './Button';
import Input from './Input';

const StudyFromFile = ({
  onBack,
  onStartQuiz,
  onGenerateGuide,
  API_KEY,
  POINTS_BY_DIFFICULTY
}) => {
  const [difficulty, setDifficulty] = useState('medio');
  const [numQuestions, setNumQuestions] = useState(5);
  const [studyMode, setStudyMode] = useState(''); // 'quiz' o 'guide'
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const {
    processedText,
    originalFileName,
    extractedTopics,
    isProcessing,
    error,
    processFile,
    clearProcessedFile,
    generateQuizFromText,
    generateGuideFromText
  } = useFileProcessor();

  const handleFileUpload = async (text, fileName) => {
    try {
      setGenerationError('');
      await processFile(text, fileName);
    } catch (err) {
      setGenerationError(err.message);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!processedText) return;

    setIsGenerating(true);
    setGenerationError('');

    try {
      const questions = await generateQuizFromText(
        processedText,
        difficulty,
        numQuestions,
        API_KEY
      );

      onStartQuiz(questions, {
        source: 'Archivo de texto',
        fileName: originalFileName,
        topics: extractedTopics
      });

    } catch (err) {
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateGuide = async () => {
    if (!processedText) return;

    setIsGenerating(true);
    setGenerationError('');

    try {
      const guide = await generateGuideFromText(
        processedText,
        difficulty,
        API_KEY
      );

      onGenerateGuide(guide);

    } catch (err) {
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAll = () => {
    clearProcessedFile();
    setStudyMode('');
    setGenerationError('');
    setDifficulty('medio');
    setNumQuestions(5);
  };

  if (studyMode) {
    return (
      <div className="max-w-4xl mx-auto animate-slide-up">
        <button
          onClick={() => setStudyMode('')}
          className="flex items-center gap-2 text-surface-500 hover:text-primary-600 font-bold mb-8 transition-premium text-sm"
        >
          <ArrowLeft size={18} /> Volver a opciones
        </button>

        <Card className="p-8 md:p-12 relative overflow-hidden" hoverEffect={false}>
          {/* Decorative background for the active mode */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl ${studyMode === 'quiz' ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gradient-to-br from-secondary-500 to-secondary-700'}`}>
                {studyMode === 'quiz' ? <FileText size={36} /> : <BookOpen size={36} />}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50 mb-2 transition-colors">
                  {studyMode === 'quiz' ? 'Generar Quiz con IA' : 'Generar Guía de Estudio'}
                </h2>
                <p className="text-surface-500 dark:text-surface-400 font-medium transition-colors">
                  Basado en: <span className="text-primary-600 dark:text-primary-400 font-bold">{originalFileName}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-3">
                <label className="text-sm font-black text-surface-500 dark:text-surface-400 uppercase tracking-widest px-1">Dificultad</label>
                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={isGenerating}
                    className="w-full px-5 py-4 bg-white dark:bg-zinc-800 border-2 border-surface-200 dark:border-white/5 rounded-2xl appearance-none focus:border-primary-500 outline-none transition-premium font-bold text-surface-700 dark:text-surface-200"
                  >
                    <option value="facil">😊 Principiante</option>
                    <option value="medio">🧠 Intermedio</option>
                    <option value="dificil">🔥 Avanzado</option>
                    <option value="experto">💎 Experto</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                    <Target size={20} />
                  </div>
                </div>
              </div>

              {studyMode === 'quiz' && (
                <div className="space-y-3">
                  <label className="text-sm font-black text-surface-500 dark:text-surface-400 uppercase tracking-widest px-1">Preguntas</label>
                  <div className="relative">
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      disabled={isGenerating}
                      className="w-full px-5 py-4 bg-white dark:bg-zinc-800 border-2 border-surface-200 dark:border-white/5 rounded-2xl appearance-none focus:border-primary-500 outline-none transition-premium font-bold text-surface-700 dark:text-surface-200"
                    >
                      <option value="3">3 rápidas</option>
                      <option value="5">5 estándar</option>
                      <option value="10">10 completas</option>
                      <option value="15">15 intensivas</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                      <Zap size={20} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Points Summary */}
            <div className="bg-surface-50 dark:bg-white/5 p-6 rounded-3xl border border-surface-100 dark:border-white/5 mb-12 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4 text-primary-600 dark:text-primary-400">
                <Sparkles className="animate-pulse-soft" />
                <span className="font-bold uppercase tracking-tight">Recompensa:</span>
              </div>
              <span className="text-3xl font-black text-surface-900 dark:text-surface-50">
                +{POINTS_BY_DIFFICULTY[difficulty]} <span className="text-sm uppercase font-black opacity-40">pts</span>
              </span>
            </div>

            {generationError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 mb-8 animate-slide-up">
                <AlertCircle size={20} /> {generationError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={studyMode === 'quiz' ? handleGenerateQuiz : handleGenerateGuide}
                disabled={isGenerating}
                isLoading={isGenerating}
                className="flex-1 py-5 text-xl"
                variant={studyMode === 'quiz' ? 'primary' : 'secondary'}
                icon={studyMode === 'quiz' ? Sparkles : BookOpen}
              >
                {studyMode === 'quiz' ? 'Generar Quiz' : 'Crear Guía'}
              </Button>
              <Button
                variant="ghost"
                onClick={resetAll}
                disabled={isGenerating}
                className="py-5 px-8 text-surface-500"
              >
                Cambiar Archivo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-surface-400 hover:text-primary-600 font-bold mb-8 transition-premium text-sm"
      >
        <ArrowLeft size={18} /> Volver al menú
      </button>

      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/20 mx-auto mb-8">
          <FileUp size={40} className="text-white" />
        </div>
        <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-4 tracking-tight transition-colors">Estudiar desde Archivo</h2>
        <p className="text-surface-500 dark:text-surface-400 text-lg font-medium max-w-xl mx-auto transition-colors">
          Sube tus notas, PDFs o documentos y deja que la IA cree el material de estudio perfecto para ti.
        </p>
      </div>

      <div className="space-y-12">
        <FileUpload
          onFileUpload={handleFileUpload}
          isLoading={isProcessing}
          error={error}
        />

        {processedText && (
          <div className="space-y-10 animate-slide-up">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-px bg-surface-200 dark:bg-white/10 flex-1" />
              <h3 className="text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-[0.3em] whitespace-nowrap">
                Acciones Disponibles
              </h3>
              <div className="h-px bg-surface-200 dark:bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setStudyMode('quiz')}
                className="group p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-transparent hover:border-primary-500/30 transition-premium shadow-xl hover:shadow-primary-500/10 text-left relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-premium">
                    <Zap size={28} />
                  </div>
                  <h4 className="text-xl font-black text-surface-900 dark:text-surface-50 mb-2 transition-colors">Quiz Interactivo</h4>
                  <p className="text-surface-500 dark:text-surface-400 font-medium leading-relaxed transition-colors">
                    Genera preguntas de opción múltiple basadas exactamente en tu contenido.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-8 text-7xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">📝</div>
              </button>

              <button
                onClick={() => setStudyMode('guide')}
                className="group p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-transparent hover:border-secondary-500/30 transition-premium shadow-xl hover:shadow-secondary-500/10 text-left relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-premium">
                    <BookOpen size={28} />
                  </div>
                  <h4 className="text-xl font-black text-surface-900 dark:text-surface-50 mb-2 transition-colors">Guía Estructurada</h4>
                  <p className="text-surface-500 dark:text-surface-400 font-medium leading-relaxed transition-colors">
                    Una explicación detallada y resumida de los puntos clave del archivo.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-8 text-7xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">📚</div>
              </button>
            </div>

            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col md:flex-row items-center gap-6 justify-between transition-premium">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <p className="font-black text-surface-900 dark:text-surface-50 transition-colors">{originalFileName}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-500 font-bold uppercase tracking-widest">{processedText.length} caracteres • Procesado</p>
                </div>
              </div>
              <button
                onClick={clearProcessedFile}
                className="px-6 py-2 rounded-xl bg-white dark:bg-zinc-900 text-sm font-bold text-surface-400 hover:text-rose-500 hover:border-rose-200 border border-surface-100 dark:border-white/5 transition-premium"
              >
                Descartar Archivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyFromFile;
