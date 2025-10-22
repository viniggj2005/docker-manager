import React from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { PruneImages } from '../../../../../wailsjs/go/docker/Docker';
import { FiSearch, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import { ToolbarProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';

const Toolbar: React.FC<ToolbarProps> = ({
  view,
  query,
  loading,
  setView,
  setQuery,
  onRefresh,
  onDeleted,
}) => {
  const confirmToast = useConfirmToast();
  const handleDelete = () => {
    confirmToast({
      title: `Imagens sem uso deletadas!`,
      message: `Deseja deletar as imagens sem uso ?`,
      onConfirm: async () => {
        await PruneImages();
        onDeleted?.();
      },
    });
  };
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[220px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--system-black)] dark:text-[var(--system-white)]" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-xl outline-none transition bg-[var(--system-white)] dark:bg-[var(--dark-primary)] dark:bg-[var(--dark-primary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]   text-[var(--system-black)] placeholder-[var(--light-gray)]"
          placeholder="Buscar por nome, tag, id ou label"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center hover:scale-95 dark:text-[var(--system-white)]  gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] dark:bg-[var(--dark-primary)] text-[var(--system-black)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] "
        title="Atualizar"
      >
        <FiRefreshCw className={`h-4 w-4   ${loading ? 'animate-spin' : ''}`} />
        <span>Atualizar</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-xl border hover:scale-95 dark:text-[var(--system-white)]  transition ${view === 'grid' ? 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]' : 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]'}`}
          title="Grade"
        >
          <FiGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView('table')}
          className={`p-2 rounded-xl border hover:scale-95 dark:text-[var(--system-white)]  transition ${view === 'table' ? 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]' : 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)]  dark:border-[var(--dark-tertiary)]'}`}
          title="Tabela"
        >
          <FiList className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className={`p-2 rounded-xl border  bg-[var(--system-white)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]  dark:bg-[var(--dark-primary)] hover:scale-95 transition`}
          title="Tabela"
        >
          <FaTrashCan className="w-4 h-4 text-[var(--exit-red)]" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
