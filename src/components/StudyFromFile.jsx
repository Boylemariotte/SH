import React, { useState } from 'react';
import { FileText, BookOpen, Sparkles, ArrowLeft, AlertCircle, CheckCircle, Award, Loader } from 'lucide-react';
import FileUpload from './FileUpload';
import TiltCard from './TiltCard';
import AIRevealText from './AIRevealText';
import { useFileProcessor } from '../hooks/useFileProcessor';
import '../styles/FileUpload.css';

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
  };

  // ─── Render: Selección de Configuración (Quiz o Guía) ──────────────
  if (studyMode) {
    return (
      <>
        <div className="page-header animate-fade-in-up stagger-1">
          <div>
            <button className="btn-back" onClick={() => setStudyMode('')}>
              <ArrowLeft size={16} /> Volver a opciones
            </button>
            <h1 className="page-title">
              {studyMode === 'quiz' ? 'Configurar Quiz' : 'Configurar Guía'}
            </h1>
            <p className="page-subtitle">
              Personaliza tu contenido basado en <strong>{originalFileName}</strong>
            </p>
          </div>
        </div>

        <div className="mode-layout">
          <TiltCard className="ss-card animate-fade-in-up stagger-2">
            {/* Status Panel */}
            <div className="info-panel info-panel-green">
              <div className="info-panel-header">
                <CheckCircle size={16} /> Archivo procesado correctamente
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                <li>Nombre: {originalFileName}</li>
                <li>Hilos de texto: {processedText.length} caracteres</li>
                <li>Temas detectados: {extractedTopics.length}</li>
              </ul>
            </div>

            {generationError && <div className="alert alert-error">⚠️ {generationError}</div>}

            <div className="form-group">
              <label className="form-label">Nivel de dificultad</label>
              <div className="select-wrapper">
                <div className="select-dot" />
                <select
                  className="form-select has-dot"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Intermedio</option>
                  <option value="dificil">Difícil</option>
                  <option value="experto">Experto</option>
                </select>
              </div>
            </div>

            {studyMode === 'quiz' && (
              <div className="form-group">
                <label className="form-label">Cantidad de preguntas</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <option value="3">3 rápidas</option>
                    <option value="5">5 estándar</option>
                    <option value="10">10 completo</option>
                    <option value="15">15 extenso</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                className={`btn ${studyMode === 'quiz' ? 'btn-primary' : 'btn-blue'} btn-shimmer`}
                onClick={studyMode === 'quiz' ? handleGenerateQuiz : handleGenerateGuide}
                disabled={isGenerating || !processedText}
                style={{ flex: 2 }}
              >
                {isGenerating ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  studyMode === 'quiz' ? <Sparkles size={18} /> : <BookOpen size={18} />
                )}
                {isGenerating ? 'Generando...' : (studyMode === 'quiz' ? 'Generar Quiz' : 'Generar Guía')}
              </button>

              <button
                className="btn btn-secondary"
                onClick={resetAll}
                disabled={isGenerating}
                style={{ flex: 1 }}
              >
                Cambiar
              </button>
            </div>
          </TiltCard>

          <TiltCard className="rewards-card animate-fade-in-up stagger-3">
            <div className="rewards-title">
              <Award size={18} /> Potencial de Puntos
            </div>
            {[
              { key: 'facil', label: 'Fácil' },
              { key: 'medio', label: 'Medio' },
              { key: 'dificil', label: 'Difícil' },
              { key: 'experto', label: 'Experto' },
            ].map(d => (
              <div className="rewards-row" key={d.key}>
                <span className="rewards-difficulty">{d.label}</span>
                <span className="rewards-pts">{POINTS_BY_DIFFICULTY[d.key]} pts</span>
              </div>
            ))}
            <p className="rewards-note">* Basado en el procesamiento de tu archivo actual.</p>
          </TiltCard>
        </div>
      </>
    );
  }

  // ─── Render: Selección de Modo / Subida de Archivo ──────────────
  return (
    <>
      <div className="page-header animate-fade-in-up stagger-1">
        <div>
          <button className="btn-back" onClick={onBack}>
            <ArrowLeft size={16} /> Volver al menú
          </button>
          <h1 className="page-title"><AIRevealText text="Estudiar desde Archivo" /></h1>
          <p className="page-subtitle">Sube un documento y deja que la IA cree materiales de estudio para ti.</p>
        </div>
      </div>

      <div className="mode-layout">
        <TiltCard className="ss-card animate-fade-in-up stagger-2">
          <FileUpload
            onFileUpload={handleFileUpload}
            isLoading={isProcessing}
            error={error}
          />

          {processedText && (
            <div style={{ marginTop: '2.5rem', animation: 'slideInUp 0.4s ease-out' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                ¿Qué quieres hacer con este archivo?
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  className="btn btn-primary btn-shimmer"
                  onClick={() => setStudyMode('quiz')}
                  style={{ height: 'auto', flexDirection: 'column', padding: '1.5rem', gap: '0.75rem' }}
                >
                  <div style={{ fontSize: '2rem' }}>📝</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>Quiz Interactivo</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.8 }}>Preguntas automáticas</span>
                  </div>
                </button>

                <button
                  className="btn btn-blue btn-shimmer"
                  onClick={() => setStudyMode('guide')}
                  style={{ height: 'auto', flexDirection: 'column', padding: '1.5rem', gap: '0.75rem' }}
                >
                  <div style={{ fontSize: '2rem' }}>📚</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>Guía de Estudio</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.8 }}>Resumen estructurado</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </TiltCard>

        <TiltCard className="rewards-card animate-fade-in-up stagger-3" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
          <div className="rewards-title">
            <FileText size={18} /> Archivos soportados
          </div>
          <p style={{ fontSize: '0.850rem', lineHeight: '1.5', opacity: 0.9, marginBottom: '1rem' }}>
            Puedes subir archivos de texto (.txt) o PDF para que nuestra IA los analice y genere contenido personalizado.
          </p>
          <div className="info-panel" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
            <div className="info-panel-header"><Sparkles size={14} /> Tip:</div>
            Asegúrate de que el texto sea claro para obtener mejores resultados en los quizzes.
          </div>
        </TiltCard>
      </div>
    </>
  );
};

export default StudyFromFile;
