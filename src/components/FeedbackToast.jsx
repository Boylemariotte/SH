import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Sparkles, Trophy, Target } from 'lucide-react';
import Icon, { StudyIcons } from './Icon';

const FeedbackToast = ({ 
  type = 'success', 
  message, 
  duration = 3000, 
  onClose,
  position = 'top-right',
  showIcon = true,
  actionText,
  onAction 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleAction = () => {
    if (onAction) onAction();
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <StudyIcons.status.success />;
      case 'error':
        return <StudyIcons.status.error />;
      case 'warning':
        return <StudyIcons.status.warning />;
      case 'info':
        return <StudyIcons.status.info />;
      case 'celebration':
        return <StudyIcons.achievements.trophy />;
      case 'achievement':
        return <StudyIcons.achievements.award />;
      case 'target':
        return <StudyIcons.achievements.target />;
      default:
        return <StudyIcons.status.info />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      success: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderColor: '#10b981',
        iconColor: '#ffffff'
      },
      error: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        borderColor: '#ef4444',
        iconColor: '#ffffff'
      },
      warning: {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderColor: '#f59e0b',
        iconColor: '#ffffff'
      },
      info: {
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        borderColor: '#3b82f6',
        iconColor: '#ffffff'
      },
      celebration: {
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        borderColor: '#8b5cf6',
        iconColor: '#ffffff'
      },
      achievement: {
        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        borderColor: '#06b6d4',
        iconColor: '#ffffff'
      },
      target: {
        background: 'linear-gradient(135deg, #84cc16, #65a30d)',
        borderColor: '#84cc16',
        iconColor: '#ffffff'
      }
    };

    return baseStyles[type] || baseStyles.info;
  };

  const styles = getStyles();

  if (!isVisible) return null;

  return (
    <div 
      className={`feedback-toast feedback-toast-${position} ${isLeaving ? 'feedback-toast-leaving' : 'feedback-toast-entering'}`}
      style={{
        background: styles.background,
        borderColor: styles.borderColor,
        '--toast-icon-color': styles.iconColor
      }}
    >
      {/* Close button */}
      <button 
        className="feedback-toast-close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <StudyIcons.ui.close size="sm" />
      </button>

      {/* Content */}
      <div className="feedback-toast-content">
        {showIcon && (
          <div className="feedback-toast-icon" style={{ color: styles.iconColor }}>
            {getIcon()}
          </div>
        )}
        
        <div className="feedback-toast-text">
          <p className="feedback-toast-message">{message}</p>
          {actionText && (
            <button 
              className="feedback-toast-action"
              onClick={handleAction}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para manejar notificaciones
export const useFeedback = () => {
  const [notifications, setNotifications] = useState([]);

  const showFeedback = (config) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      ...config,
      isVisible: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    setTimeout(() => {
      removeFeedback(id);
    }, config.duration || 3000);
  };

  const removeFeedback = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    showFeedback({ type: 'success', message, ...options });
  };

  const showError = (message, options = {}) => {
    showFeedback({ type: 'error', message, duration: 5000, ...options });
  };

  const showWarning = (message, options = {}) => {
    showFeedback({ type: 'warning', message, ...options });
  };

  const showInfo = (message, options = {}) => {
    showFeedback({ type: 'info', message, ...options });
  };

  const showCelebration = (message, options = {}) => {
    showFeedback({ type: 'celebration', message, duration: 4000, ...options });
  };

  const showAchievement = (message, options = {}) => {
    showFeedback({ type: 'achievement', message, duration: 4000, ...options });
  };

  const showTarget = (message, options = {}) => {
    showFeedback({ type: 'target', message, ...options });
  };

  return {
    notifications,
    showFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCelebration,
    showAchievement,
    showTarget,
    removeFeedback
  };
};

// Container para todas las notificaciones
export const FeedbackContainer = () => {
  const { notifications, removeFeedback } = useFeedback();

  return (
    <div className="feedback-container">
      {notifications.map(notification => (
        <FeedbackToast
          key={notification.id}
          {...notification}
          onClose={() => removeFeedback(notification.id)}
        />
      ))}
    </div>
  );
};

export default FeedbackToast;
