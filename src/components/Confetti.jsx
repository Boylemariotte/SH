import React, { useEffect, useState } from 'react';

const Confetti = ({ isActive, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Generar partículas de confeti
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#a855f7', '#ec4899'];
      const newParticles = [];
      
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 2,
          speedY: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }
      
      setParticles(newParticles);
      
      // Limpiar después de la duración
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            '--x': `${particle.x}%`,
            '--y': `${particle.y}%`,
            '--color': particle.color,
            '--size': `${particle.size}px`,
            '--speedX': `${particle.speedX}px`,
            '--speedY': `${particle.speedY}px`,
            '--rotation': `${particle.rotation}deg`,
            '--rotationSpeed': `${particle.rotationSpeed}deg`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
