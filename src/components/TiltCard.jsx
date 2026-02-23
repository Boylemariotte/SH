import React, { useState, useRef } from 'react';

const TiltCard = ({ children, className = "", ...props }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
        const rotateY = ((x - centerX) / centerX) * 10;

        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
        setTransform('rotateX(0deg) rotateY(0deg)');
    };

    return (
        <div className="tilt-card-container" style={{ width: '100%' }}>
            <div
                ref={cardRef}
                className={`tilt-card ${className}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transform }}
                {...props}
            >
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
