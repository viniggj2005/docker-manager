import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useDockerClient } from '../contexts/DockerClientContext';
import { VolumeService } from '../features/volumes/services/VolumeService';
import VolumeCard from '../features/volumes/components/cards/VolumeCard';
import { VolumeItem } from '../interfaces/VolumeInterfaces';
import CreateVolumeModal from '../features/volumes/components/modals/CreateVolumeModal';

const VolumesPage: React.FC = () => {
  const { connecting, selectedCredentialId, loading: credentialsLoading } = useDockerClient();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volumes, setVolumes] = useState<VolumeItem[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const fetchVolumes = useCallback(async () => {
    if (!selectedCredentialId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await VolumeService.listVolumes(selectedCredentialId);

      const volumesList = response?.Volumes ?? [];
      const warningsList = response?.Warnings ?? [];

      setVolumes(Array.isArray(volumesList) ? volumesList : []);
      setWarnings(Array.isArray(warningsList) ? warningsList.filter(Boolean) : []);
    } catch (err) {
      console.error('Erro ao carregar volumes Docker:', err);
      setError('Erro ao carregar volumes Docker');
      setVolumes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCredentialId]);

  useEffect(() => {
    if (!selectedCredentialId || credentialsLoading || connecting) return;
    fetchVolumes();
  }, [selectedCredentialId, credentialsLoading, connecting, fetchVolumes]);

  const handleDeleted = (name: string) => {
    setVolumes((prev) => prev.filter((volume) => volume.Name !== name));
  };

  const safeVolumes = useMemo(() => (Array.isArray(volumes) ? volumes : []), [volumes]);

  if (credentialsLoading || connecting) {
    return <div>Conectando ao cliente Docker...</div>;
  }

  if (!selectedCredentialId) {
    return <div>Nenhuma credencial Docker selecionada.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">Volumes Docker</h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Visualize, crie e remova volumes Docker.
        </p>
      </div>

      <button
        onClick={() => setOpenCreateModal(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-3 text-sm font-semibold text-[var(--docker-blue)] shadow-sm transition hover:scale-[0.99] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] sm:w-fit"
      >
        <IoMdAddCircleOutline className="h-5 w-5" />
        Novo volume
      </button>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-semibold">Avisos do Docker:</p>
          <ul className="list-disc pl-4">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && <div>Carregando volumes...</div>}
      {error && <div className="text-[var(--exit-red)] text-sm">{error}</div>}

      {!loading && safeVolumes.length === 0 && !error && (
        <div className="text-sm text-[var(--medium-gray)]">Nenhum volume encontrado.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {safeVolumes.map((volume) => (
          <VolumeCard key={volume.Name} clientId={selectedCredentialId} onDeleted={handleDeleted} {...volume} />
        ))}
      </div>

      <CreateVolumeModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onCreated={fetchVolumes} />
    </div>
  );
};

export default VolumesPage;
