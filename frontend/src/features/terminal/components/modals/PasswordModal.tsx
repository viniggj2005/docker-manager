import React, { useState } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { PasswordModalProps } from '../../../../interfaces/TerminalInterfaces';

const PasswordModal: React.FC<PasswordModalProps> = ({ open, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)] backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[360px] bg-[var(--system-white)] 
                   dark:bg-[var(--dark-primary)] rounded-2xl border 
                   border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] 
                   shadow-2xl text-[var(--dark-text)] dark:text-[var(--system-white)]"
      >
        <div
          className="flex items-center justify-between gap-3 border-b 
                        border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] 
                        px-5 py-3 rounded-t-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <h2 className="text-sm font-medium">Senha SSH necessária</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-1 text-[var(--light-red)] hover:scale-95 transition-transform"
            title="Fechar"
          >
            <IoMdCloseCircleOutline className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Digite sua senha SSH</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="rounded-lg border border-[var(--light-gray)] 
                         dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] 
                         px-3 py-2 text-sm outline-none focus:border-blue-500 
                         dark:focus:border-blue-400 transition-colors"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-lg border border-[var(--light-gray)] 
                         dark:border-[var(--dark-tertiary)] px-4 py-1.5 text-sm 
                         hover:bg-[var(--light-gray)] dark:hover:bg-[var(--dark-secondary)] 
                         transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 
                         dark:bg-blue-500 dark:hover:bg-blue-600 
                         text-white px-4 py-1.5 text-sm transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
