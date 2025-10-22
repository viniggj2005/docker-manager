import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoMdAddCircleOutline } from 'react-icons/io';
import GoBackButton from '../features/shared/components/buttons/GoBackButton';
import SshConnectionList from '../features/terminal/components/list/SshConnectionList';
import ToggleThemeButton from '../features/shared/components/buttons/ToggleThemeButton';
import SshConnectionModal from '../features/terminal/components/modals/CreateSshConnectionModal';

const TerminalFormPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--system-white)] dark:bg-[var(--dark-primary)] p-6">
        <div className="mx-auto max-w-6xl animate-pulse text-[var(--grey-text)]">Carregando…</div>
      </div>
    );
  }
  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-screen bg-[var(--system-white)] dark:bg-[var(--dark-primary)] p-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-6 dark:bg-[var(--dark-secondary)]">
          <div className="text-sm dark:text-[var(--system-white)]">
            Sessão inválida. Faça login.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[var(--system-white)] dark:bg-[var(--dark-primary)]">
      <header className="border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <GoBackButton onGoBack={() => setOpen(false)} />
          <h1 className="ml-1 text-lg font-semibold dark:text-[var(--system-white)]">
            Conexões SSH
          </h1>
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
        <SshConnectionList key={reloadFlag} token={token} />
      </main>

      <SshConnectionModal
        onCreated={() => setReloadFlag((previous) => previous + 1)}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="absolute bottom-4 left-3">
        <ToggleThemeButton />
      </div>
    </div>
  );
};

export default TerminalFormPage;
