import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import ContainersListView from '../features/containers/ContainersList';
import ListContainersImages from '../features/containersImages/ListContainerImages';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Bem-vindo ao painel Docker Manager
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Acompanhe o status dos seus containers e imagens favoritas em um só lugar.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <ContainersListView />
        </section>
        <section className="rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <ListContainersImages />
        </section>
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
