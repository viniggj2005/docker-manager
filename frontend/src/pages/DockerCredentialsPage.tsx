import React, { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import DockerCredentialsList from '../features/dockerCredentials/components/list/DockerCredentialsList';
import DockerCredentialCreateForm from '../features/dockerCredentials/components/forms/DockerCredentialCreateForm';

const DockerCredentialsPage: React.FC = () => {
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Credenciais Docker
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Gerencie conexões TLS do Docker para acessar servidores remotos.
        </p>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowNewCredentialForm(!showNewCredentialForm)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-4 py-3 text-sm font-semibold text-[var(--docker-blue)] shadow-sm transition hover:scale-[0.99] hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] sm:w-fit"
        >
          <IoMdAddCircleOutline className="h-5 w-5" />
          Nova conexão
        </button>
      </div>
      {showNewCredentialForm && (
        <DockerCredentialCreateForm onSuccess={() => setShowNewCredentialForm(false)} />
      )}

      <div className="space-y-4">
        <DockerCredentialsList />
      </div>
    </div>
  );
};

export default DockerCredentialsPage;

