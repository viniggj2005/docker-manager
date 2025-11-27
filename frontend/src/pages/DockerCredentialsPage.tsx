import iziToast from 'izitoast';
import { FaTrashCan } from 'react-icons/fa6';
import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileUploader } from 'react-drag-drop-files';
import { useDockerClient } from '../contexts/DockerClientContext';
import TextField from '../features/login/components/fields/TextField';
import { useConfirmToast } from '../features/shared/components/toasts/ConfirmToast';
import { DockerCredentialService } from '../features/dockerCredentials/services/DockerCredentialService';

const fileTypes = ['PEM', 'TXT'];

const DockerCredentialsPage: React.FC = () => {
  const { user, token, loading: authLoading, isAuthenticated } = useAuth();
  const {
    credentials,
    selectedCredentialId,
    setSelectedCredentialId,
    refresh,
    loading: credentialsLoading,
    connecting,
  } = useDockerClient();
  const [ca, setCa] = useState('');
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const confirmToast = useConfirmToast();
  const [cert, setCert] = useState('');
  const [alias, setAlias] = useState('');
  const [caFileName, setCaFileName] = useState('');
  const [keyFileName, setKeyFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [certFileName, setCertFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const disableForm = !token || !user || submitting;

  const handleFileUpload = async (
    file: File | File[],
    setContent: React.Dispatch<React.SetStateAction<string>>,
    setName: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (disableForm) return;
    const selectedFile = Array.isArray(file) ? file[0] : file;
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      setContent(text);
      setName(selectedFile.name);
    } catch (error) {
      iziToast.error({
        title: 'Erro',
        message: 'Não foi possível ler o arquivo selecionado.',
        position: 'bottomRight',
      });
    }
  };

  const handleCaUpload = (file: File | File[]) => handleFileUpload(file, setCa, setCaFileName);
  const handleCertUpload = (file: File | File[]) => handleFileUpload(file, setCert, setCertFileName);
  const handleKeyUpload = (file: File | File[]) => handleFileUpload(file, setKey, setKeyFileName);

  const sortedCredentials = useMemo(
    () => credentials.slice().sort((a, b) => a.alias.localeCompare(b.alias)),
    [credentials]
  );

  if (authLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto max-w-3xl text-sm text-[var(--grey-text)]">Carregando…</div>
      </div>
    );
  }

  if (!isAuthenticated || !token || !user) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 text-sm text-[var(--medium-gray)] shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]">
          Sessão inválida. Faça login para gerenciar suas credenciais Docker.
        </div>
      </div>
    );
  }
  const handleDelete = (id: number, name: string) => {
    confirmToast({
      id: `${id}`,
      title: `Conexão ${name} deletada!`,
      message: `Deseja deletar A conexão ${name} docker?`,
      onConfirm: async () => {
        await DockerCredentialService.delete(token, id)
        await refresh()
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!alias.trim() || !url.trim() || !ca.trim() || !cert.trim() || !key.trim()) {
      setFormError('Preencha todos os campos antes de salvar.');
      return;
    }

    try {
      setSubmitting(true);
      await DockerCredentialService.create(token, {
        alias: alias.trim(),
        url: url.trim(),
        ca,
        cert,
        key,
        userId: user.id,
      });
      setAlias('');
      setUrl('');
      setCa('');
      setCert('');
      setKey('');
      setCaFileName('');
      setCertFileName('');
      setKeyFileName('');
      iziToast.success({
        title: 'Sucesso!',
        message: 'Credencial criada com sucesso.',
        position: 'bottomRight',
      });
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFormError(message);
      iziToast.error({ title: 'Erro', message, position: 'bottomRight' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
          Credenciais Docker
        </h1>
        <p className="text-sm text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
          Cadastre conexões TLS e selecione qual ambiente Docker você deseja administrar.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[2fr,3fr]">
        <section className="rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
                Nova credencial
              </h2>
              <p className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
                Informe o host e as chaves TLS geradas para o daemon Docker remoto.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <TextField
              label="Alias"
              name="alias"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              placeholder="Produção – São Paulo"
              required
              disabled={disableForm}
            />

            <TextField
              label="Endpoint"
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="tcp://meu-docker:2376"
              required
              disabled={disableForm}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-1">
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]"
                    htmlFor="ca"
                  >
                    CA (PEM)
                  </label>
                  <div
                    className={`rounded-xl border border-dashed border-[var(--light-gray)] p-4 text-sm transition dark:border-[var(--dark-tertiary)] ${disableForm
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:border-[var(--docker-blue)]'
                      }`}
                  >
                    <FileUploader
                      handleChange={handleCaUpload}
                      name="ca"
                      types={fileTypes}
                      disabled={disableForm}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>
                          {caFileName
                            ? `Selecionado: ${caFileName}`
                            : 'Arraste e solte ou clique para enviar'}
                        </span>
                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                      </div>
                    </FileUploader>
                  </div>
                </div>
                <textarea
                  id="ca"
                  value={ca}
                  onChange={(event) => setCa(event.target.value)}
                  placeholder="-----BEGIN CERTIFICATE-----\n..."
                  className="h-28 w-full rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-2 text-sm text-[var(--system-black)] transition focus:outline-none focus:ring-2 focus:ring-[var(--docker-blue)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
                  disabled={disableForm}
                  required
                />
              </div>

              <div className="grid gap-2 sm:col-span-1">
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]"
                    htmlFor="cert"
                  >
                    Cert (PEM)
                  </label>
                  <div
                    className={`rounded-xl border border-dashed border-[var(--light-gray)] p-4 text-sm transition dark:border-[var(--dark-tertiary)] ${disableForm
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:border-[var(--docker-blue)]'
                      }`}
                  >
                    <FileUploader
                      handleChange={handleCertUpload}
                      name="cert"
                      types={fileTypes}
                      disabled={disableForm}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>
                          {certFileName
                            ? `Selecionado: ${certFileName}`
                            : 'Arraste e solte ou clique para enviar'}
                        </span>
                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                      </div>
                    </FileUploader>
                  </div>
                </div>
                <textarea
                  id="cert"
                  value={cert}
                  onChange={(event) => setCert(event.target.value)}
                  placeholder="-----BEGIN CERTIFICATE-----\n..."
                  className="h-28 w-full rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-2 text-sm text-[var(--system-black)] transition focus:outline-none focus:ring-2 focus:ring-[var(--docker-blue)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
                  disabled={disableForm}
                  required
                />
              </div>

              <div className="grid gap-2 sm:col-span-1">
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]"
                    htmlFor="key"
                  >
                    Key (PEM)
                  </label>
                  <div
                    className={`rounded-xl border border-dashed border-[var(--light-gray)] p-4 text-sm transition dark:border-[var(--dark-tertiary)] ${disableForm
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:border-[var(--docker-blue)]'
                      }`}
                  >
                    <FileUploader
                      handleChange={handleKeyUpload}
                      name="key"
                      types={fileTypes}
                      disabled={disableForm}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>
                          {keyFileName
                            ? `Selecionado: ${keyFileName}`
                            : 'Arraste e solte ou clique para enviar'}
                        </span>
                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                      </div>
                    </FileUploader>
                  </div>
                </div>
                <textarea
                  id="key"
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY-----\n..."
                  className="h-28 w-full rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-2 text-sm text-[var(--system-black)] transition focus:outline-none focus:ring-2 focus:ring-[var(--docker-blue)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
                  disabled={disableForm}
                  required
                />
              </div>
            </div>

            {formError ? (
              <div className="text-sm text-[var(--exit-red)]">{formError}</div>
            ) : null}

            <button
              type="submit"
              disabled={disableForm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--docker-blue)] px-4 py-2 text-base font-semibold text-[var(--system-white)] transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Salvando…' : 'Salvar credencial'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-6 shadow-sm dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)]">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
                Minhas credenciais
              </h2>
              <p className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
                Selecione uma credencial para utilizá-la nas páginas de containers e imagens.
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-2 text-sm font-medium text-[var(--docker-blue)] transition hover:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]"
              disabled={credentialsLoading}
            >
              {credentialsLoading ? 'Atualizando…' : 'Atualizar'}
            </button>
          </header>

          {sortedCredentials.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--light-gray)] p-6 text-sm text-[var(--medium-gray)] dark:border-[var(--dark-tertiary)] dark:text-[var(--grey-text)]">
              Nenhuma credencial cadastrada até o momento.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {sortedCredentials.map((credential) => {
                const isActive = credential.id === selectedCredentialId;
                return (
                  <li key={credential.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedCredentialId(credential.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition hover:scale-[0.99] ${isActive
                          ? 'border-[var(--docker-blue)] bg-[var(--light-overlay)] text-[var(--docker-blue)] dark:border-[var(--docker-blue)] dark:bg-[var(--dark-tertiary)]'
                          : 'border-[var(--light-gray)] bg-[var(--system-white)] text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]'
                        }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{credential.alias}</span>
                        <span className="text-xs text-[var(--medium-gray)] dark:text-[var(--grey-text)]">
                          ID {credential.id}
                        </span>
                      </div>
                      
                      {isActive ? (
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--docker-blue)] dark:text-[var(--system-white)]">
                          Selecionada
                        </span>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(credential.id, credential.alias);
                        }}
                        title="Excluir Conexão"
                        className="px-2 py-1 hover:scale-90 rounded-lg"
                      >
                        <FaTrashCan className="text-[var(--exit-red)] h-6 w-6" />
                      </button>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {connecting ? (
            <div className="mt-4 rounded-xl border border-[var(--light-gray)] bg-[var(--light-overlay)] p-3 text-xs text-[var(--medium-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-tertiary)] dark:text-[var(--grey-text)]">
              Estabelecendo conexão segura com o Docker remoto…
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default DockerCredentialsPage;

