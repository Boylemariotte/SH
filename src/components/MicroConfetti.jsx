import React, { useEffect, useState } from 'react';

const MicroConfetti = ({ isActive, x, y }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#10b981', '#3b82f6', '#f59e0b'];
      const newParticles = [];
      
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
          angle: (Math.PI * 2 * i) / 12,
          speed: Math.random() * 2 + 1
        });
      }
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div 
      className="micro-confetti-container" 
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="micro-confetti-particle"
          style={{
            '--color': particle.color,
            '--size': `${particle.size}px`,
            '--tx': `${Math.cos(particle.angle) * particle.speed * 30}px`,
            '--ty': `${Math.sin(particle.angle) * particle.speed * 30}px`
          }}
        />
      ))}
    </div>
  );
};

export default MicroConfetti;
