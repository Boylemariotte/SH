import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label className="text-sm font-bold text-surface-700 px-1 tracking-tight">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-3 bg-white/50 dark:bg-zinc-800/50 border-2 border-surface-200 dark:border-white/5 rounded-xl 
          text-surface-900 dark:text-surface-50 placeholder-surface-400 dark:placeholder-surface-500
          transition-premium focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-zinc-800
          disabled:opacity-50 disabled:bg-surface-100 dark:disabled:bg-zinc-900
          ${error ? 'border-accent-rose' : ''}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs font-semibold text-accent-rose px-1">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
