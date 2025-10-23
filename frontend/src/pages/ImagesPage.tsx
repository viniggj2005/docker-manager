import React from 'react';
import ListContainersImages from '../features/containersImages/ListContainerImages';

const ImagesPage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Imagens Docker
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Pesquise, organize e remova imagens quando necessário.
        </p>
      </header>

      <div className="flex-1 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
        <ListContainersImages />
      </div>
    </div>
  );
};

export default ImagesPage;
