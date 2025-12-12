import iziToast from 'izitoast';
import React, { useEffect, useRef } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import CreateNetworkForm from '../forms/CreateNetworkForm';
import { ModalProps } from '../../../../interfaces/TerminalInterfaces';

const CreateNetworkModal: React.FC<ModalProps> = ({ open, onClose, onCreated }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-white/60 dark:bg-black/60 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-labelledby="network-modal-title"
    >
      <div
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl bg-white
          rounded-2xl border border-gray-300 dark:border-white/10
          dark:bg-zinc-900 shadow-2xl text-black dark:text-white"
      >
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b
         border-gray-300 dark:border-white/10 px-5 py-3
         bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            <h2 id="network-modal-title" className="text-sm font-medium text-black dark:text-white">
              Nova Network Docker
            </h2>
            <span className="text-xs text-gray-500 dark:text-zinc-400">preencha os dados</span>
          </div>

          <button
            onClick={onClose}
            className="ml-auto text-rose-400 hover:scale-95"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <IoMdCloseCircleOutline className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-auto p-5">
          <CreateNetworkForm
            onSuccess={() => {
              iziToast.success({
                title: 'Criado com sucesso',
                message: 'A network foi criada.',
                position: 'bottomRight',
                timeout: 3000,
              });
              onClose();
              onCreated?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNetworkModal;
