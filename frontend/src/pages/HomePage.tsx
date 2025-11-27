import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlinePlus, HiOutlineViewGrid } from 'react-icons/hi';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col h-full gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Bem-vindo ao painel Docker Manager
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Acompanhe o status dos seus containers e imagens em um só lugar.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm transition hover:border-[var(--docker-blue)] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--light-overlay)] text-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)]">
            <HiOutlineViewGrid className="h-6 w-6" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
              Gerencie containers
            </h2>
            <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
              Acesse o painel completo para iniciar, pausar ou renomear containers a qualquer
              momento.
            </p>
          </div>
          <button
            onClick={() => navigate('/containers')}
            className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[var(--docker-blue)] px-5 py-3 text-sm font-semibold text-[var(--system-white)] shadow transition hover:scale-[0.99] hover:shadow-md"
          >
            Acessar containers
          </button>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm transition hover:border-[var(--docker-blue)] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--light-overlay)] text-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)]">
            <HiOutlinePhotograph className="h-6 w-6" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
              Gerencie imagens
            </h2>
            <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
              Filtre e exclua imagens rapidamente para manter seu ambiente organizado.
            </p>
          </div>
          <button
            onClick={() => navigate('/images')}
            className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[var(--docker-blue)] px-5 py-3 text-sm font-semibold text-[var(--system-white)] shadow transition hover:scale-[0.99] hover:shadow-md"
          >
            Acessar imagens
          </button>
        </article>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[var(--docker-blue)] bg-[var(--light-overlay)] p-6 dark:border-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
            Precisa conectar em um servidor?
          </h2>
          <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
            Crie uma nova conexão SSH e gerencie seus terminais com rapidez.
          </p>
        </div>
        <button
          onClick={() => navigate('/createConnectionForm')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--docker-blue)] px-5 py-3 text-sm font-semibold text-[var(--system-white)] shadow transition hover:scale-[0.99] hover:shadow-md"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Criar conexão SSH
        </button>
      </div>
    </div>
  );
};
export default HomePage;
