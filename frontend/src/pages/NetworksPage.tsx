import { IoMdAddCircleOutline } from 'react-icons/io';
import { NetworkItem } from '../interfaces/NetworkInterfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { useDockerClient } from '../contexts/DockerClientContext';
import { NetworkService } from '../features/networks/services/NetworkService';
import NetworkCards from '../features/networks/components/cards/NetworkCards';
import CreateNetworkModal from '../features/networks/components/modals/CreateNetworkModals';

const NetworksPage: React.FC = () => {
  const {
      connecting,
      selectedCredentialId,
    loading: credentialsLoading,
  } = useDockerClient();
const [openCreateModal, setOpenCreateModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networks, setNetworks] = useState<NetworkItem[] | null>(null);

  const fetchNetworks = useCallback(async () => {
    if (!selectedCredentialId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await NetworkService.findAllNetworks(selectedCredentialId);
      console.log('ListNetworks result bruto:', result);

      if (Array.isArray(result)) {
        setNetworks(result);
      } else {
        console.warn('Formato inesperado de redes:', result);
        setNetworks([]);
      }
    } catch (err) {
      console.error('Erro ao carregar redes Docker:', err);
      setError('Erro ao carregar redes Docker');
      setNetworks([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCredentialId]);

  useEffect(() => {
    if (!selectedCredentialId || credentialsLoading || connecting) return;
    fetchNetworks();
  }, [selectedCredentialId, credentialsLoading, connecting, fetchNetworks]);

  const handleDeleted = (networkId: string) => {
    setNetworks((prev) =>
      Array.isArray(prev) ? prev.filter((n) => n.Id === networkId ? false : true) : prev
    );
  };

  if (credentialsLoading || connecting) {
    return <div>Conectando ao cliente Docker...</div>;
  }

  if (!selectedCredentialId) {
    return <div>Nenhuma credencial Docker selecionada.</div>;
  }

  const safeNetworks = Array.isArray(networks) ? networks : [];

  return (
    <div className="space-y-4">
      <div>
          <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
            Redes Docker
          </h1>
          <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Gerencie suas rede docker e crie novas.
          </p>
        </div>
      <button
              onClick={() => setOpenCreateModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-3 text-sm font-semibold text-[var(--docker-blue)] shadow-sm transition hover:scale-[0.99] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] sm:w-fit"
            >
              <IoMdAddCircleOutline className="h-5 w-5" />
              Nova Network
            </button>
      {loading && <div>Carregando redes...</div>}
      {error && <div className="text-[var(--exit-red)] text-sm">{error}</div>}

      {!loading && safeNetworks.length === 0 && !error && (
        <div className="text-sm text-[var(--medium-gray)]">
          Nenhuma rede encontrada.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {safeNetworks.map((network) => (
          <NetworkCards
            key={network.Id}
            clientId={selectedCredentialId}
            onDeleted={handleDeleted}
            {...network}
          />
        ))}
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
