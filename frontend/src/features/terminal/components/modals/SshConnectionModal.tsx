import React, { useEffect, useRef } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import CreateSshConnectionForm from '../forms/CreateSshConnectionForm';
import { ModalProps } from '../../../../interfaces/TerminalInterfaces';

const SshConnectionModal: React.FC<ModalProps> = ({ open, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)] backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-labelledby="ssh-modal-title"
    >
      <div
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl bg-[var(--system-white)]
          rounded-2xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]
          dark:bg-[var(--dark-primary)] shadow-2xl dark:text-[var(--system-white)]"
      >
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-5 py-3 dark:bg-[var(--dark-primary)]">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h2 id="ssh-modal-title" className="text-sm font-medium">
              Nova conexão SSH
            </h2>
            <span className="text-xs text-[var(--grey-text)]">preencha os dados</span>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-[var(--light-red)] hover:scale-95"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <IoMdCloseCircleOutline className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-auto p-5">
          <CreateSshConnectionForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SshConnectionModal;
