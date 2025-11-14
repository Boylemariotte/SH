import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = ({ topic }) => {
  return (
    <div className="duo-container">
      <div className="duo-card">
        <div className="duo-loading">
          <div className="duo-loading-spinner" aria-label="Cargando">
            <Loader />
          </div>
          <h2 className="duo-loading-title">
            Generando tu quiz...
          </h2>
          <p className="duo-loading-text">
            La IA está creando preguntas sobre: <strong>{topic}</strong>
          </p>
          <div className="duo-progress-container">
            <div className="duo-progress-bar">
              <div className="duo-progress-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingScreen);
