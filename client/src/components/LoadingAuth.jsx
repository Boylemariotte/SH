import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
    }}>
      <div className="duo-card" style={{ maxWidth: '300px', textAlign: 'center' }}>
        <div className="duo-loading">
          <div className="duo-loading-spinner">
            <Loader />
          </div>
          <h2 className="duo-loading-title">Cargando...</h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

