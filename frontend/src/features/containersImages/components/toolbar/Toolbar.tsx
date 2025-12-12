import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { ToolbarProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { PruneImages } from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

const Toolbar: React.FC<ToolbarProps> = ({
  view,
  query,
  setView,
  setQuery,
  onDeleted,
  onBuildImage,
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
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex-1 max-w-md relative">
        <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nome, tag, ID ou label"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBuildImage}
          disabled={disabled}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:opacity-90 disabled:opacity-50 text-sm transition-colors whitespace-nowrap"
        >
          Construir Imagem
        </button>

        <button
          onClick={() => !disabled && setView('grid')}
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors ${view === 'grid'
            ? 'bg-blue-100 dark:bg-blue-600 text-white cursor-not-allowed'
            : 'hover:bg-gray-100 text-gray-600'
            }`}
          title="Grade"
        >
          <FiGrid className="h-5 w-5" />
        </button>
        <button
          onClick={() => !disabled && setView('table')}
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors ${view === 'table'
            ? 'bg-blue-100 dark:bg-blue-600 text-white cursor-not-allowed'
            : 'hover:bg-gray-100 text-gray-600'
            }`}
          title="Tabela"
        >
          <FiList className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={disabled}
          className={`p-2 hover:bg-red-50 hover:scale-90 rounded-lg transition-colors`}
          title="Tabela"
        >
          <FaRegTrashAlt className="text-red-600 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
