import { IoMdAddCircleOutline } from 'react-icons/io';
import { NetworkItem } from '../interfaces/NetworkInterfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { useDockerClient } from '../contexts/DockerClientContext';
import NetworkCards from '../features/networks/components/cards/NetworkCards';
import { NetworkService } from '../features/networks/services/NetworkService';
import CreateNetworkModal from '../features/networks/components/modals/CreateNetworkModal';

const NetworksPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networks, setNetworks] = useState<NetworkItem[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { connecting, selectedCredentialId, loading: credentialsLoading } = useDockerClient();

  const fetchNetworks = useCallback(async () => {
    if (!selectedCredentialId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await NetworkService.findAllNetworks(selectedCredentialId);
      setNetworks(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Erro ao carregar redes Docker:', error);
      setError('Erro ao carregar redes Docker');
    } finally {
      setLoading(false);
    }
  }, [selectedCredentialId]);

  useEffect(() => {
    if (!selectedCredentialId || credentialsLoading || connecting) return;
    fetchNetworks();
  }, [selectedCredentialId, credentialsLoading, connecting, fetchNetworks]);

  const handleDeleted = (networkId: string) => {
    setNetworks((prev) => prev.filter((network) => network.Id !== networkId));
  };

  const showStatusMessage = (message: string, isError = false) => (
    <div
      className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${isError
        ? 'border-[var(--exit-red)] text-[var(--exit-red)]'
        : 'border-[var(--light-gray)] text-[var(--medium-gray)] dark:border-[var(--dark-tertiary)] dark:text-[var(--grey-text)]'
        }`}
    >
      {message}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Redes Docker
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Gerencie suas redes Docker, crie novas e acompanhe detalhes das existentes.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
              Conexão Docker
            </span>
            <span className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
              {connecting || credentialsLoading
                ? 'Sincronizando credenciais...'
                : selectedCredentialId
                  ? 'Credencial ativa para listagem de redes.'
                  : 'Selecione uma credencial para gerenciar as redes.'}
            </span>
          </div>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-2 text-sm font-semibold text-[var(--docker-blue)] shadow-sm transition hover:scale-[0.99] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)] sm:w-fit"
          >
            <IoMdAddCircleOutline className="h-5 w-5" />
            Nova rede
          </button>
        </div>

        {credentialsLoading || connecting ? (
          showStatusMessage('Conectando ao cliente Docker...')
        ) : !selectedCredentialId ? (
          showStatusMessage('Nenhuma credencial Docker selecionada.', true)
        ) : (
          <div className="flex flex-col gap-4">
            {loading && showStatusMessage('Carregando redes...')}
            {error && showStatusMessage(error, true)}

            {!loading && networks.length === 0 && !error &&
              showStatusMessage('Nenhuma rede encontrada para a credencial selecionada.')}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {networks.map((network) => (
                <NetworkCards
                  key={network.Id}
                  clientId={selectedCredentialId}
                  onDeleted={handleDeleted}
                  {...network}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateNetworkModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={fetchNetworks}
      />
    </div>
  );
};

export default NetworksPage;
