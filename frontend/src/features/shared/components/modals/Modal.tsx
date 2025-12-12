import React, { useEffect, useRef } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { createPortal } from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    theme?: 'light' | 'dark';
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    icon,
    footer,
    size = 'md',
    className = '',
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'max-w-md';
            case 'lg': return 'max-w-4xl';
            case 'xl': return 'max-w-6xl';
            case 'full': return 'max-w-[95vw] h-[95vh]';
            case 'md':
            default: return 'max-w-2xl';
        }
    };

    const modalContent = (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center
      bg-white/60 dark:bg-black/60 backdrop-blur-sm p-4"
            aria-modal
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div
                ref={dialogRef}
                onClick={(event) => event.stopPropagation()}
                className={`relative w-full ${getSizeClasses()} bg-white
          rounded-2xl border border-gray-300 dark:border-white/10
          dark:bg-zinc-900 shadow-2xl text-black dark:text-white flex flex-col max-h-[90vh] ${className}`}
            >
                <div className="flex-none flex items-center rounded-t-2xl gap-3 border-b
         border-gray-300 dark:border-white/10 px-5 py-3
         bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-2">
                        {icon ? (
                            <div className="flex items-center justify-center">
                                {icon}
                            </div>
                        ) : (
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                        )}
                        <h2 id="modal-title" className="text-sm font-medium text-black dark:text-white">
                            {title}
                        </h2>
                        {description && (
                            <span className="text-xs text-gray-500 dark:text-zinc-400">{description}</span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="ml-auto text-rose-400 hover:scale-95 transition-transform"
                        title="Fechar"
                        aria-label="Fechar modal"
                    >
                        <IoMdCloseCircleOutline className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-5">
                    {children}
                </div>

                {footer && (
                    <div className="flex-none border-t border-gray-300 dark:border-white/10 p-4 bg-gray-50/50 dark:bg-white/5 rounded-b-2xl flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
