import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

type Props = { onRefresh: () => void };

const ContainersHeader: React.FC<Props> = ({ onRefresh }) => (
  <header className="mb-4 flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-[var(--system-black)]">Containers</h1>
    <button
      onClick={onRefresh}
      className="inline-flex items-center hover:scale-95  gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] text-[var(--system-black)] border border-[var(--light-gray)] hover:border-[var(--light-gray)]"
      title="Atualizar"
    >
      <FiRefreshCw className="h-4 w-4" />
      <span>Atualizar</span>
    </button>
  </header>
);

export default ContainersHeader;
