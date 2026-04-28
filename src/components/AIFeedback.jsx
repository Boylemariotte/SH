import React, { useState, useEffect } from 'react';
import { 
  Target, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  Brain, 
  Award,
  Loader2,
  Quote,
  XCircle,
  Flag
} from 'lucide-react';
import { generatePersonalizedFeedback } from '../utils/errorAnalysis.js';

const AIFeedback = ({ 
  questions, 
  userAnswers, 
  topic, 
  difficulty,
  onAction 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const aiFeedback = await generatePersonalizedFeedback(
          questions, 
          userAnswers, 
          topic, 
          difficulty
        );
        setFeedback(aiFeedback);
      } catch (err) {
        console.error('Error loading AI feedback:', err);
        setError('No se pudo generar la retroalimentación personalizada');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [questions, userAnswers, topic, difficulty]);

  if (isLoading) {
    return (
      <div className="ai-feedback-section">
        <div className="feedback-loading">
          <Loader2 className="animate-spin" size={24} />
          <h3>
            <Brain size={20} className="inline mr-2" />
            Analizando tu rendimiento...
          </h3>
          <p>Generando retroalimentación personalizada con IA</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-feedback-section">
        <div className="feedback-error">
          <AlertCircle size={20} className="inline mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <div className="ai-feedback-section">
      <div className="feedback-header">
        <Brain size={24} className="inline mr-2" />
        <h3>Análisis Personalizado con IA</h3>
      </div>

      {/* Fortalezas Detectadas */}
      {feedback.strengths && feedback.strengths.length > 0 && (
        <div className="feedback-strengths">
          <h4>
            <Target size={18} className="inline mr-2" />
            Fortalezas Detectadas
          </h4>
          <ul>
            {feedback.strengths.map((strength, index) => (
              <li key={index}>
                <CheckCircle size={16} className="inline mr-2 text-green-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Errores Específicos */}
      {feedback.specificErrors && feedback.specificErrors.length > 0 && (
        <div className="feedback-specific-errors">
          <h4>
            <XCircle size={18} className="inline mr-2" />
            Errores Específicos Identificados
          </h4>
          <ul>
            {feedback.specificErrors.map((error, index) => (
              <li key={index}>
                <AlertCircle size={16} className="inline mr-2 text-red-500" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conceptos a Revisar */}
      {feedback.conceptsToReview && feedback.conceptsToReview.length > 0 && (
        <div className="feedback-concepts">
          <h4>
            <BookOpen size={18} className="inline mr-2" />
            Conceptos Específicos a Repasar
          </h4>
          <ul>
            {feedback.conceptsToReview.map((concept, index) => (
              <li key={index}>
                <Flag size={16} className="inline mr-2 text-amber-500" />
                <strong>{concept}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sugerencias de Estudio */}
      {feedback.recommendations && feedback.recommendations.length > 0 && (
        <div className="feedback-recommendations">
          <h4>
            <Lightbulb size={18} className="inline mr-2" />
            Plan de Estudio Personalizado
          </h4>
          <div className="recommendations-grid">
            {feedback.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.priority === 'alta' ? 'priority-high' : 'priority-medium'}`}>
                <div className="recommendation-header">
                  <BookOpen size={16} className="inline mr-2" />
                  <h5>{rec.title}</h5>
                  {rec.priority === 'alta' && (
                    <span className="priority-badge">Alta Prioridad</span>
                  )}
                </div>
                <p>{rec.description}</p>
                <div className="recommendation-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => onAction && onAction(rec.action)}
                  >
                    {rec.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje Motivacional */}
      {feedback.motivation && (
        <div className="feedback-motivation">
          <div className="motivation-quote">
            <Quote size={20} className="inline mr-2" />
            <p>{feedback.motivation}</p>
          </div>
        </div>
      )}

      {/* Badge de Logro */}
      <div className="feedback-achievement">
        <Award size={20} className="inline mr-2" />
        <span>¡Análisis completado con éxito!</span>
      </div>
    </div>
  );
};

export default AIFeedback;
