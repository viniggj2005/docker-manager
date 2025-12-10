import React from 'react';
import ListContainersImages from '../features/containersImages/ListContainerImages';

const ImagesPage: React.FC = () => {
  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Imagens Docker
        </h1>
        <p className="text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Pesquise, organize e remova imagens quando necessário.
        </p>
      </div>

      <ListContainersImages />
    </div>
  );
};

export default ImagesPage;
