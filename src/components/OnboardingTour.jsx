import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, BookOpen, Target, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import Icon, { StudyIcons } from './Icon';

const OnboardingTour = ({ onComplete, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourVisible, setIsTourVisible] = useState(isVisible);

  const tourSteps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Study Helper!',
      content: 'Soy tu compañero de estudio inteligente. Voy a guiarte para que aproveches al máximo nuestra plataforma.',
      icon: <StudyIcons.education.study />,
      position: 'center',
      action: 'Empezar el recorrido'
    },
    {
      id: 'sidebar',
      title: 'Navegación principal',
      content: 'Aquí encontrarás todas las herramientas: quizzes personalizados, guías de estudio, seguimiento de tu progreso y mucho más.',
      icon: <StudyIcons.nav.guide />,
      position: 'sidebar',
      action: 'Ver siguiente'
    },
    {
      id: 'quiz',
      title: 'Crea tus quizzes',
      content: 'Elige cualquier tema que quieras estudiar. Yo generaré preguntas adaptadas a tu nivel, desde conceptos básicos hasta temas avanzados.',
      icon: <StudyIcons.nav.quiz />,
      position: 'main',
      action: 'Continuar'
    },
    {
      id: 'progress',
      title: 'Tu progreso importa',
      content: 'Aquí verás cómo mejoras día a día. Cada pregunta te ayuda a identificar tus fortalezas y áreas de oportunidad.',
      icon: <StudyIcons.nav.stats />,
      position: 'stats',
      action: '¡Entendido!'
    },
    {
      id: 'ready',
      title: '¿Listo para empezar?',
      content: 'Ahora tienes todo lo necesario para estudiar de manera inteligente. ¡Comencemos este viaje juntos!',
      icon: <StudyIcons.achievements.trophy />,
      position: 'center',
      action: 'Comenzar a estudiar'
    }
  ];

  useEffect(() => {
    setIsTourVisible(isVisible);
  }, [isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsTourVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsTourVisible(false);
    onComplete();
  };

  if (!isTourVisible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="onboarding-overlay">
        {/* Highlight areas */}
        {currentTourStep.position === 'sidebar' && (
          <div className="onboarding-highlight onboarding-highlight-sidebar" />
        )}
        {currentTourStep.position === 'main' && (
          <div className="onboarding-highlight onboarding-highlight-main" />
        )}
        {currentTourStep.position === 'stats' && (
          <div className="onboarding-highlight onboarding-highlight-stats" />
        )}
      </div>

      {/* Tour Tooltip */}
      <div className={`onboarding-tooltip onboarding-tooltip-${currentTourStep.position}`}>
        {/* Close button */}
        <button className="onboarding-close" onClick={handleSkip} aria-label="Saltar tutorial">
          <StudyIcons.ui.close />
        </button>

        {/* Content */}
        <div className="onboarding-content">
          {/* Icon */}
          <div className="onboarding-icon">
            {currentTourStep.icon}
          </div>

          {/* Text */}
          <div className="onboarding-text">
            <h3 className="onboarding-title">{currentTourStep.title}</h3>
            <p className="onboarding-description">{currentTourStep.content}</p>
          </div>

          {/* Progress */}
          <div className="onboarding-progress">
            <div className="onboarding-dots">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
            <span className="onboarding-step-text">
              Paso {currentStep + 1} de {tourSteps.length}
            </span>
          </div>

          {/* Actions */}
          <div className="onboarding-actions">
            <button
              className="onboarding-btn-secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <Icon name="chevronLeft" size="sm" />
              Anterior
            </button>
            
            <button
              className="onboarding-btn-primary"
              onClick={handleNext}
            >
              {currentTourStep.action}
              <Icon name="chevronRight" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
