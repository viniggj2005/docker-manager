import React from 'react';
import ContainersListView from '../features/containers/ContainersList';

const ContainersPage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Containers Docker
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Monitore e administre seus containers em tempo real.
        </p>
      </header>

      <div className="flex-1 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
        <ContainersListView />
      </div>
    </div>
  );
};

export default ContainersPage;
