import { GoPencil } from 'react-icons/go';
import { FaTrashCan } from 'react-icons/fa6';
import { MdCastConnected } from 'react-icons/md';
import { useTerminalStore } from '../../TerminalStore';
import { useAuth } from '../../../../contexts/AuthContext';
import React, { useCallback, useEffect, useState } from 'react';
import { SshDto } from '../../../../interfaces/TerminalInterfaces';
import EditSshConnectionModal from '../modals/EditSshConnectionModal';
import { TerminalServices, toSshConn } from '../../services/TerminalServices';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';

const SshConnectionList: React.FC<{ token: string }> = ({ token }) => {
  const { user } = useAuth();
  const confirmToast = useConfirmToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openWith, requirePassword } = useTerminalStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [connectionsList, setConnectionsList] = useState<SshDto[]>([]);
  const [editingConnection, setEditingConnection] = useState<SshDto | null>(null);

  const loadConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await TerminalServices.findAllByUser(user ? user.id : 1, token);
      setConnectionsList(list);
    } catch (error: any) {
      setError(error?.message ?? 'Erro ao buscar conexões');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = useCallback(
    (id: number, alias: string) => {
      confirmToast({
        id: String(id),
        title: `Conexão ${alias} deletada!`,
        message: `Deseja deletar a conexão: ${alias}?`,
        onConfirm: async () => {
          await TerminalServices.deleteConnection(token, id);
          await loadConnections();
        },
      });
    },
    [token]
  );

  const handleEdit = (connection: SshDto) => {
    setEditingConnection(connection);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditingConnection(null);
  };

  const handleConnect = async (id: number) => {
    try {
      const connection = await TerminalServices.getById(token, id);
      const ssh = toSshConn(connection);
      const hasKey = !!(connection.key && connection.key.length);
      hasKey ? openWith(ssh) : requirePassword(ssh);
    } catch (e) {
      setError('Falha ao abrir terminal');
    }
  };

  useEffect(() => {
    loadConnections();
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
    <>
      <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-2 dark:bg-[var(--dark-secondary)]">
        <ul className="divide-y divide-[var(--light-gray)] dark:divide-[var(--dark-tertiary)]">
          {connectionsList.map((connection) => (
            <li key={connection.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0">
                <div className="truncate font-medium dark:text-[var(--system-white)]">
                  {connection.alias || `${connection.systemUser}@${connection.host}`}
                </div>
                <div className="text-xs text-[var(--grey-text)]">
                  {connection.systemUser}@{connection.host}:{connection.port}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <button
                  onClick={() => handleConnect(connection.id)}
                  title="Conectar ao terminal"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:scale-[0.98] dark:text-[var(--system-white)]"
                >
                  <MdCastConnected className="h-6 w-6" />
                </button>

                <button
                  onClick={() => handleEdit(connection)}
                  title="Editar conexão"
                  className="px-2 py-1 hover:scale-90 rounded-lg"
                >
                  <GoPencil className="text-[var(--docker-blue)] w-6 h-6" />
                </button>

                <button
                  onClick={() =>
                    handleRemove(
                      connection.id,
                      connection.alias || `${connection.systemUser}@${connection.host}`
                    )
                  }
                  title="Excluir Conexão"
                  className="px-2 py-1 hover:scale-90 rounded-lg"
                >
                  <FaTrashCan className="text-[var(--exit-red)] h-6 w-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingConnection && (
        <EditSshConnectionModal
          open={editModalOpen}
          onClose={handleCloseEdit}
          onCreated={loadConnections}
          connection={editingConnection}
        />
      )}
    </>
  );
};

export default SshConnectionList;
