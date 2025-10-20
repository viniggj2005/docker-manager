import React, { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import ToggleThemeButton from '../features/shared/components/buttons/ToggleThemeButton';
import SshConnectionModal from '../features/terminal/components/modals/SshConnectionModal';

const TerminalFormPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--system-white)] dark:bg-[var(--dark-primary)]">
      <header className="border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <h1 className="text-lg font-semibold dark:text-[var(--system-white)]">Conexões SSH</h1>
          <span className="text-xs text-[var(--grey-text)]">Gerencie acessos remotos</span>
          <button
            onClick={() => setOpen(true)}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-3 py-2 text-sm hover:scale-[0.98] dark:text-[var(--system-white)]"
          >
            <IoMdAddCircleOutline className="h-5 w-5" />
            Nova conexão
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-6 dark:bg-[var(--dark-secondary)]">
          <div className="text-sm text-[var(--grey-text)]">
            Nenhuma conexão listada. Clique em <span className="font-medium">Nova conexão</span>{' '}
            para criar.
          </div>
        </div>
      </main>

      <SshConnectionModal open={open} onClose={() => setOpen(false)} />
      <div className="absolute bottom-4 left-3">
        <ToggleThemeButton />
      </div>
    </div>
  );
};

export default TerminalFormPage;
