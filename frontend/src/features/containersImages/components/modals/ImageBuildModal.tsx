import React, { useEffect, useRef } from 'react';
import ImageBuildForm from '../forms/ImageBuildForm';
import { IoMdCloseCircleOutline } from 'react-icons/io';

interface ImageBuildModalProps {
    clientId: number;
    onClose: () => void;
    onSuccess?: () => void;
}

const ImageBuildModal: React.FC<ImageBuildModalProps> = ({ clientId, onClose, onSuccess }) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm"
            aria-modal
            role="dialog"
            aria-labelledby="build-modal-title"
        >
            <div
                ref={dialogRef}
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-300 dark:border-white/10 dark:bg-zinc-900 shadow-2xl dark:text-white"
            >
                <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-gray-300 dark:border-white/10 px-5 py-3 dark:bg-zinc-900">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                        <h2 id="build-modal-title" className="text-sm font-medium">
                            Construir Nova Imagem
                        </h2>
                        <span className="text-xs text-zinc-400">preencha os dados</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-6 w-6 items-center justify-center
                                   rounded-full text-red-600
                                   hover:bg-red-600 hover:text-white hover:scale-95 transition"
                        title="Fechar"
                        aria-label="Fechar modal"
                    >
                        <IoMdCloseCircleOutline className="h-5 w-5" />
                    </button>
                </div>
                <div className="max-h-[80vh] overflow-auto p-5">
                    <ImageBuildForm
                        clientId={clientId}
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageBuildModal;
