import React, { useState } from 'react';
import { FileText, BookOpen, Sparkles, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import FileUpload from './FileUpload';
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
      
      // Pasar las preguntas y la información del archivo al componente principal
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

  if (studyMode) {
    return (
      <div className="study-from-file-container">
        <div className="duo-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div className="duo-header">
            <button 
              onClick={() => setStudyMode('')}
              className="back-btn"
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <ArrowLeft size={20} />
              Volver a opciones
            </button>
            
            <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              {studyMode === 'quiz' ? <FileText className="duo-avatar-icon" /> : <BookOpen className="duo-avatar-icon" />}
            </div>
            <h1 className="duo-title">
              {studyMode === 'quiz' ? 'Quiz desde Archivo' : 'Guía desde Archivo'}
            </h1>
            <p className="duo-subtitle">
              Basado en: <strong>{originalFileName}</strong>
            </p>
          </div>

          {/* Información del archivo */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontWeight: '600', color: '#059669' }}>Archivo procesado</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#047857' }}>
              <div>• {processedText.length} caracteres de texto</div>
              <div>• {extractedTopics.length} temas identificados</div>
              {extractedTopics.length > 0 && (
                <div>• Temas principales: {extractedTopics.slice(0, 5).join(', ')}</div>
              )}
            </div>
          </div>

          {/* Configuración */}
          <div className="duo-input-group">
            <label className="duo-label">
              🎯 Nivel de dificultad
            </label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="duo-input"
              disabled={isGenerating}
            >
              <option value="facil">😊 Fácil - Para principiantes</option>
              <option value="medio">🧠 Medio - Nivel intermedio</option>
              <option value="dificil">🔥 Difícil - Desafiante</option>
              <option value="experto">💎 Experto - Muy avanzado</option>
            </select>
          </div>

          {studyMode === 'quiz' && (
            <div className="duo-input-group">
              <label className="duo-label">
                📊 Cantidad de preguntas
              </label>
              <select 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="duo-input"
                disabled={isGenerating}
              >
                <option value="3">3 preguntas - Rápido</option>
                <option value="5">5 preguntas - Normal</option>
                <option value="10">10 preguntas - Completo</option>
                <option value="15">15 preguntas - Extenso</option>
              </select>
            </div>
          )}

          {/* Puntos disponibles */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px',
            color: 'white'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              Puntos por completar al 100%:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div>😊 Fácil: {POINTS_BY_DIFFICULTY.facil} pts</div>
              <div>🧠 Medio: {POINTS_BY_DIFFICULTY.medio} pts</div>
              <div>🔥 Difícil: {POINTS_BY_DIFFICULTY.dificil} pts</div>
              <div>💎 Experto: {POINTS_BY_DIFFICULTY.experto} pts</div>
            </div>
          </div>

          {/* Error de generación */}
          {generationError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '1rem',
              color: '#dc2626',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              {generationError}
            </div>
          )}

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={studyMode === 'quiz' ? handleGenerateQuiz : handleGenerateGuide}
              disabled={isGenerating || !processedText}
              className="duo-btn duo-btn-success"
              style={{ flex: 1 }}
            >
              {isGenerating ? (
                <>
                  <span className="duo-loading-spinner" style={{ marginRight: '8px' }}></span>
                  Generando...
                </>
              ) : (
                studyMode === 'quiz' ? 'Generar Quiz' : 'Generar Guía'
              )}
            </button>
            
            <button
              onClick={resetAll}
              disabled={isGenerating}
              className="duo-btn"
              style={{ 
                background: '#6b7280',
                color: 'white',
                ':hover': { background: '#4b5563' }
              }}
            >
              Cambiar archivo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal: selección de modo
  return (
    <div className="study-from-file-container">
      <div className="duo-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div className="duo-header">
          <button 
            onClick={onBack}
            className="back-btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={20} />
            Volver al menú
          </button>
          
          <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <FileText className="duo-avatar-icon" />
          </div>
          <h1 className="duo-title">Estudiar desde Archivo</h1>
          <p className="duo-subtitle">Sube un archivo de texto para generar quizzes y guías personalizadas</p>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '2rem' }}>
          <FileUpload 
            onFileUpload={handleFileUpload}
            isLoading={isProcessing}
            error={error}
          />
        </div>

        {/* Opciones de estudio (solo si hay archivo procesado) */}
        {processedText && (
          <div className="study-options">
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '1.5rem', 
              color: '#374151' 
            }}>
              ¿Qué te gustaría generar?
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Opción Quiz */}
              <button
                onClick={() => setStudyMode('quiz')}
                className="study-option-card"
                style={{
                  background: 'linear-gradient(135deg, #6b46c1 0%, #805ad5 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Quiz Interactivo</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                  Pon a prueba tu conocimiento con preguntas basadas en tu texto
                </p>
              </button>

              {/* Opción Guía */}
              <button
                onClick={() => setStudyMode('guide')}
                className="study-option-card"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Guía de Estudio</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                  Obtén una guía estructurada para entender mejor el contenido
                </p>
              </button>
            </div>

            {/* Información del archivo procesado */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: '600', color: '#059669' }}>Archivo listo para procesar</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#047857' }}>
                <strong>{originalFileName}</strong> • {processedText.length} caracteres
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyFromFile;
