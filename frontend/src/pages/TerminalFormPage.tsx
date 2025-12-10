import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoMdAddCircleOutline } from 'react-icons/io';
import SshConnectionList from '../features/terminal/components/list/SshConnectionList';
import SshConnectionModal from '../features/terminal/components/modals/CreateSshConnectionModal';

const TerminalFormPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <div className="mx-auto max-w-4xl animate-pulse text-[var(--grey-text)]">Carregando…</div>
      </div>
    );
  }
  if (!isAuthenticated || !token) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 text-sm text-[var(--medium-gray)] shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]">
          Sessão inválida. Faça login.
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
            Conexões SSH
          </h1>
          <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Gerencie acessos remotos e ative novos terminais.
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-3 text-sm font-semibold text-[var(--docker-blue)] shadow-sm transition hover:scale-[0.99] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] sm:w-fit"
      >
        <IoMdAddCircleOutline className="h-5 w-5" />
        Nova conexão
      </button>

      <div>
        <SshConnectionList key={reloadFlag} token={token} />
      </div>

      <SshConnectionModal
        onCreated={() => setReloadFlag((previous) => previous + 1)}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default TerminalFormPage;
