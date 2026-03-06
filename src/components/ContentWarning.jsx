import React from 'react';
import { AlertTriangle, BookOpen } from 'lucide-react';

const ContentWarning = ({ message, suggestion, onDismiss }) => {
  return (
    <div className="content-warning">
      <div className="warning-header">
        <AlertTriangle size={20} className="warning-icon" />
        <h3>Contenido no permitido</h3>
      </div>
      
      <p className="warning-message">{message}</p>
      
      {suggestion && (
        <div className="warning-suggestion">
          <BookOpen size={16} className="suggestion-icon" />
          <span>Sugerencia: {suggestion}</span>
        </div>
      )}
      
      <button className="btn btn-secondary" onClick={onDismiss}>
        Entendido
      </button>
    </div>
  );
};

export default ContentWarning;
