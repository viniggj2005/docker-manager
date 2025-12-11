import React, { useRef } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import ContainersListView, { ContainersListFetchRef } from '../features/containers/ContainersList';

const ContainersPage: React.FC = () => {
  const containerListRef = useRef<ContainersListFetchRef>(null);

  const handleRefresh = () => {
    containerListRef.current?.refresh();
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Containers Docker
          </h1>
          <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Monitore e administre seus containers em tempo real.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Atualizar"
        >
          <FiRefreshCw className="h-4 w-4" />
          <span>Atualizar</span>
        </button>
      </div>
      <ContainersListView ref={containerListRef} />
    </div>
  );
};

export default ContainersPage;
