import React from 'react';

const Celebration = () => {
  return (
    <div className="duo-celebration" role="alert" aria-live="polite">
      <div className="duo-celebration-content">
        <div className="duo-celebration-emoji" aria-hidden="true">🎉</div>
        <div className="duo-celebration-text">¡Correcto!</div>
      </div>
    </div>
  );
};

export default React.memo(Celebration);
