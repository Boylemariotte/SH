import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-premium active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    const variants = {
        primary: "bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-primary-500/25",
        secondary: "bg-secondary-600 text-white shadow-lg hover:bg-secondary-700 hover:shadow-secondary-500/25",
        ghost: "bg-surface-50 dark:bg-zinc-800 text-surface-700 dark:text-surface-200 border border-surface-100 dark:border-white/10 hover:bg-surface-100 dark:hover:bg-zinc-700 shadow-sm transition-colors",
        success: "bg-accent-emerald text-white shadow-lg hover:bg-emerald-600 shadow-emerald-500/25",
        danger: "bg-accent-rose text-white shadow-lg hover:bg-rose-600 shadow-rose-500/25",
        amber: "bg-accent-amber text-white shadow-lg hover:bg-amber-600 shadow-amber-500/25",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : Icon && <Icon size={size === 'sm' ? 18 : 22} />}
            {children}
        </button>
    );
};

export default Button;
