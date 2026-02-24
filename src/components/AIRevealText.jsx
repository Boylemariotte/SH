import React, { useState, useEffect } from 'react';

const AIRevealText = ({ text, delay = 50, scrambleSpeed = 40, className = "" }) => {
    const [displayText, setDisplayText] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    useEffect(() => {
        let iteration = 0;
        let interval = null;

        // Start delay before beginning the effect
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(
                    text.split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('')
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setIsRevealed(true);
                }

                iteration += 1 / 2; // Increased reveal speed (was 1/3)
            }, scrambleSpeed);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay, scrambleSpeed]);

    return (
        <span className={`${className} ai-reveal-container`}>
            {displayText}
            {!isRevealed && <span className="ai-reveal-cursor">|</span>}
        </span>
    );
};

export default AIRevealText;
