import React from 'react';

export interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const ModalButton: React.FC<ModalButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'secondary':
                return 'bg-white dark:bg-white/5 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10';
            case 'danger':
                return 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20';
            case 'ghost':
                return 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5';
            case 'primary':
            default:
                return 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20';
        }
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={`
        px-4 py-2 rounded-xl text-sm font-medium transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 justify-center
        ${getVariantClasses()}
        ${className}
      `}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}
        </button>
    );
};
