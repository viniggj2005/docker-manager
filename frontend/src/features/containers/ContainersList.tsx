import { FiRefreshCw } from 'react-icons/fi';
import React, { useEffect, useRef, useState } from 'react';
import ContainerCard from './components/cards/ContainerCard';
import { FmtName } from '../shared/functions/TreatmentFunction';
import { ContainerItem } from '../../interfaces/ContainerInterfaces';
import { getContainers, renameContainer, toggleContainerState } from './services/ContainersService';

const ContainersListView: React.FC = () => {
  const timerRef = useRef<number | null>(null);
  const [containers, setcontainers] = useState<ContainerItem[] | null>(null);
  const [LogsModalId, setLogsModalId] = useState<string | null>(null);
  const [MenuModalId, setMenuModalId] = useState<string | null>(null);
  const [editNameModalId, setEditNameModalId] = useState<string | null>(null);

  const fetchContainers = async () => {
    const containers = await getContainers();
    setcontainers(containers);
  };

  const handleRename = async (name: string, id: string) => {
    await renameContainer(id, name);
    await fetchContainers();
    setEditNameModalId(null);
  };

  const changeContainerStage = async (id: string, state: string) => {
    await toggleContainerState(id, state);
    await fetchContainers();
  };

  useEffect(() => {
    fetchContainers();
    timerRef.current = window.setInterval(fetchContainers, 2000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-8xl p-6">
        <header className="mb-4 flex containers-center justify-between">
          <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
            Containers
          </h1>
          <button
            onClick={fetchContainers}
            className="inline-flex containers-center hover:scale-95 gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] text-[var(--system-black)] dark:text-[var(--system-white)] border dark:border-[var(--dark-tertiary)] border-[var(--light-gray)] dark:bg-[var(--dark-secondary)]"
            title="Atualizar"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </button>
        </header>

        {!containers ? (
          <p>Buscando containeres...</p>
        ) : containers.length === 0 ? (
          <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] bg-[var(--system-white)] p-8 text-center text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Nenhum container encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {containers.map((container) => {
              const name = FmtName(container.Names);
              const isSeeing = LogsModalId === container.Id;
              const isOpened = MenuModalId === container.Id;
              const isEditing = editNameModalId === container.Id;

              return (
                <ContainerCard
                  name={name}
                  key={container.Id}
                  isSeeing={isSeeing}
                  isOpened={isOpened}
                  container={container}
                  isEditing={isEditing}
                  onRename={handleRename}
                  onTogglePause={changeContainerStage}
                  onCloseLogs={() => setLogsModalId(null)}
                  onCloseMenu={() => setMenuModalId(null)}
                  onCloseEdit={() => setEditNameModalId(null)}
                  onOpenLogs={() => setLogsModalId(container.Id)}
                  onOpenMenu={() => setMenuModalId(container.Id)}
                  onOpenEdit={() => setEditNameModalId(container.Id)}
                  onDeleted={async () => {
                    await fetchContainers();
                    setMenuModalId(null);
                  }}
                />
              );
            })}
          </div>
        )}

        <footer className="mt-6 text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Atualiza a cada 2s. Clique em “Atualizar” para forçar agora.
        </footer>
      </div>
    </div>
  );
};

export default ContainersListView;
