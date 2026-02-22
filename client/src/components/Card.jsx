import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, noPadding = false }) => {
    return (
        <div className={`
          card-premium dark:bg-zinc-900 dark:border-white/5
          ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-primary-900/10' : ''} 
          ${noPadding ? 'p-0' : 'p-6'} 
          ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
