import React, { useEffect, useState } from 'react';
import { TerminalServices } from '../../services/TerminalServices';
import { ConnectionProps, SshDto } from '../../../../interfaces/TerminalInterfaces';
import { useAuth } from '../../../../contexts/AuthContext';

const SshConnectionList: React.FC<ConnectionProps> = ({ token, onConnect }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionsList, setConnectionsList] = useState<SshDto[]>([]);

  const loadConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const connectionsList = await TerminalServices.findAllByUser(user ? user?.id : 1, token);
      setConnectionsList(connectionsList);
    } catch (error: any) {
      setError(error?.message ?? 'Erro ao buscar conexões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const connectionsList = await TerminalServices.findAllByUser(user ? user.id : 1, token);
        if (!cancelled) setConnectionsList(connectionsList);
      } catch (error: any) {
        if (!cancelled) setError(error?.message ?? 'Erro ao buscar conexões');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-6 dark:bg-[var(--dark-secondary)]">
        <div className="animate-pulse text-sm text-[var(--grey-text)]">Carregando conexões…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 dark:border-red-800 p-6 dark:bg-[var(--dark-secondary)]">
        <div className="text-sm text-red-600 dark:text-red-400">Erro: {error}</div>
        <button
          onClick={loadConnections}
          className="mt-3 rounded-lg border px-3 py-2 text-sm hover:scale-[0.98]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!connectionsList.length) {
    return (
      <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-6 dark:bg-[var(--dark-secondary)]">
        <div className="text-sm text-[var(--grey-text)]">
          Nenhuma conexão listada. Clique em <span className="font-medium">Nova conexão</span> para
          criar.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-2 dark:bg-[var(--dark-secondary)]">
      <ul className="divide-y divide-[var(--light-gray)] dark:divide-[var(--dark-tertiary)]">
        {connectionsList.map((connection) => (
          <li key={connection.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0">
              <div className="truncate font-medium dark:text-[var(--system-white)]">
                {connection.name || `${connection.systemUser}@${connection.host}`}
              </div>
              <div className="text-xs text-[var(--grey-text)]">
                {connection.systemUser}@{connection.host}:{connection.port}
              </div>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => onConnect(connection.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-3 py-2 text-sm hover:scale-[0.98] dark:text-[var(--system-white)]"
                aria-label={`Conectar em ${connection.name || `${connection.systemUser}@${connection.host}`}`}
              >
                Conectar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SshConnectionList;
