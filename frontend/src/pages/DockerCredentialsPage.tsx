import React, { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import DockerCredentialsList from '../features/dockerCredentials/components/list/DockerCredentialsList';
import { CreateDockerCredentialModal } from '../features/dockerCredentials/components/modals/CreateDockerCredentialModal';
import { useAuth } from '../contexts/AuthContext';
import { useDockerClient } from '../contexts/DockerClientContext';

const DockerCredentialsPage: React.FC = () => {
  const [showNewCredentialForm, setShowNewCredentialForm] = useState(false);
  const { user, token } = useAuth();
  const { refresh } = useDockerClient();

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Credenciais Docker
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Gerencie conexões TLS do Docker para acessar servidores remotos.
        </p>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowNewCredentialForm(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:scale-[0.99] hover:shadow-md sm:w-fit"
        >
          <IoMdAddCircleOutline className="h-5 w-5" />
          Nova conexão
        </button>
      </div>
      <CreateDockerCredentialModal
        open={showNewCredentialForm}
        onClose={() => setShowNewCredentialForm(false)}
        token={token || ''}
        userId={user?.id || 0}
        refresh={refresh}
      />

      <div className="space-y-4">
        <DockerCredentialsList />
      </div>
    </div>
  );
};

export default DockerCredentialsPage;

