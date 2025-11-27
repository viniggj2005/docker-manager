import React from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { FiSearch, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { ToolbarProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { PruneImages } from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

const Toolbar: React.FC<ToolbarProps> = ({
  view,
  query,
  loading,
  setView,
  setQuery,
  onRefresh,
  onDeleted,
  disabled = false,
}) => {
  const confirmToast = useConfirmToast();
  const { selectedCredentialId } = useDockerClient();
  const handleDelete = () => {
    if (disabled || selectedCredentialId == null) return;
    confirmToast({
      title: `Imagens sem uso deletadas!`,
      message: `Deseja deletar as imagens sem uso ?`,
      onConfirm: async () => {
        await PruneImages(selectedCredentialId);
        onDeleted?.();
      },
    });
  };
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[220px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--system-black)] dark:text-[var(--system-white)]" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-xl outline-none transition bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)]   text-[var(--system-black)] placeholder-[var(--light-gray)]"
          placeholder="Buscar por nome, tag, id ou label"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <button
        onClick={() => {
          if (disabled) return;
          onRefresh();
        }}
        disabled={disabled}
        className="inline-flex items-center hover:scale-95 dark:text-[var(--system-white)] gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] dark:bg-[var(--dark-primary)] text-[var(--system-black)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] disabled:cursor-not-allowed disabled:opacity-60"
        title="Atualizar"
      >
        <FiRefreshCw className={`h-4 w-4   ${loading ? 'animate-spin' : ''}`} />
        <span>Atualizar</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => !disabled && setView('grid')}
          disabled={disabled}
          className={`p-2 rounded-xl border hover:scale-95 dark:text-[var(--system-white)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
            view === 'grid'
              ? 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]'
              : 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]'
          }`}
          title="Grade"
        >
          <FiGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => !disabled && setView('table')}
          disabled={disabled}
          className={`p-2 rounded-xl border hover:scale-95 dark:text-[var(--system-white)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
            view === 'table'
              ? 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]'
              : 'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-[var(--light-gray)]  dark:border-[var(--dark-tertiary)]'
          }`}
          title="Tabela"
        >
          <FiList className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={disabled}
          className={`p-2 rounded-xl border bg-[var(--system-white)] border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] hover:scale-95 transition disabled:cursor-not-allowed disabled:opacity-60`}
          title="Tabela"
        >
          <FaTrashCan className="w-4 h-4 text-[var(--exit-red)]" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
