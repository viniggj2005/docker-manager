import React from 'react';
import { ViewMode } from '../../interfaces/ContainerImagesInterfaces';
import { FiSearch, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';

interface Props {
  query: string;
  setQuery: (v: string) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  onRefresh: () => void;
  loading: boolean;
}

const Toolbar: React.FC<Props> = ({ query, setQuery, view, setView, onRefresh, loading }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[220px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--system-black)]" />
        <input
          className="w-full pl-9 pr-3 py-2 rounded-xl outline-none transition bg-[var(--system-white)] border border-[var(--light-gray)] focus:border-[var(--light-gray)] text-[var(--system-black)] placeholder-[var(--light-gray)]"
          placeholder="Buscar por nome, tag, id ou label"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] text-[var(--system-black)] border border-[var(--light-gray)] hover:border-[var(--light-gray)]"
        title="Atualizar"
      >
        <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        <span>Atualizar</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-xl border transition ${view === 'grid' ? 'bg-[var(--system-white)] border-[var(--light-gray)]' : 'bg-[var(--system-white)] border-[var(--light-gray)] hover:border-[var(--light-gray)]'}`}
          title="Grade"
        >
          <FiGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView('table')}
          className={`p-2 rounded-xl border transition ${view === 'table' ? 'bg-[var(--System-white)] border-[var(--light-gray)]' : 'bg-[var(--system-white)] border-[var(--light-gray)] hover:border-[var(--light-gray)]'}`}
          title="Tabela"
        >
          <FiList className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
