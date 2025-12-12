import React from 'react';
import { Modal } from './Modal';
import { ModalButton } from './ModalButton';
import { AlertTriangle, Info, Trash2, CheckCircle2 } from 'lucide-react';

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    theme?: 'light' | 'dark';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isLoading = false,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'danger': return <Trash2 className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getButtonVariant = () => {
        switch (type) {
            case 'danger': return 'danger';
            case 'success': return 'primary';
            default: return 'primary';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={getIcon()}
            size="sm"
            footer={
                <>
                    <ModalButton variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </ModalButton>
                    <ModalButton
                        variant={getButtonVariant()}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </ModalButton>
                </>
            }
        >
            <div className="py-2">
                <p className="text-gray-600 dark:text-gray-300">
                    {message}
                </p>
            </div>
        </Modal>
    );
};
