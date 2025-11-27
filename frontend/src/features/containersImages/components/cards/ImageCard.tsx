import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FaTrashCan, FaTag } from 'react-icons/fa6';
import { DockerImageIcon } from '../../../shared/Icons';
import { MdContentCopy, MdContentPasteSearch } from 'react-icons/md';
import { copyToClipboard } from '../../../shared/functions/clipboard';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { ImageProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { RemoveImage, InspectImage } from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';
import { FmtAgo, FormatBytes, EpochToDateStr, ParseNameAndTag } from '../../../shared/functions/TreatmentFunction';

const ImageCard: React.FC<ImageProps> = ({ image, onDeleted }) => {
  const id = image?.Id ?? '';
  const confirmToast = useConfirmToast();
  const { selectedCredentialId } = useDockerClient();
  const { name, tag } = ParseNameAndTag(image?.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectContent, setInspectContent] = useState<string | null>(null);

  const ensureClient = () => {
    if (selectedCredentialId == null) {
      iziToast.error({
        title: 'Credencial não selecionada',
        message: 'Escolha uma credencial Docker para executar esta ação.',
        position: 'bottomRight',
      });
      return null;
    }
    return selectedCredentialId;
  };

  const handleDelete = () => {
    const clientId = ensureClient();
    if (clientId == null) return;
    confirmToast({
      id,
      title: `Imagem ${name}:${tag} deletada!`,
      message: `Deseja deletar a imagem: ${name}:${tag} ?`,
      onConfirm: async () => {
        const latestClientId = ensureClient();
        if (latestClientId == null) return;
        await RemoveImage(latestClientId, id);
        onDeleted?.();
      },
    });
  };

  const handleInspect = async () => {
    try {
      const clientId = ensureClient();
      if (clientId == null) return;
      const result = await InspectImage(clientId, id);
      const payload = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      setInspectContent(payload);
      iziToast.success({
        title: 'Sucesso!',
        message: 'Os dados da imagem foram retornados!',
        position: 'bottomRight',
      });
      setIsInspectOpen(true);
    } catch (error: any) {
      iziToast.error({ title: 'Erro', message: String(error), position: 'bottomRight' });
    }
  };

  return (
    <div
      className="group flex h-full w-full flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md
                 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl border border-[var(--light-gray)] p-2 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
            <DockerImageIcon className="h-6 w-6 text-[var(--docker-blue)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start gap-2">
              <span
                title={name}
                className="min-w-0 flex-1 pe-2 text-lg font-medium leading-tight break-words text-[var(--system-black)] dark:text-[var(--system-white)]"
              >
                {name}
              </span>

              <span className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--light-gray)] bg-[var(--system-white)] px-2 py-0.5 text-xs text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
                <FaTag /> {tag}
              </span>

              {!image?.RepoTags?.length && (
                <span className="shrink-0 rounded-full border border-[var(--light-gray)] px-2 py-0.5 text-xs text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)]">
                  dangling
                </span>
              )}
            </div>

            <div className="mt-1 text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
              {FormatBytes(image?.Size || 0)}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleDelete}
            title="Excluir"
            className="hover:scale-95 text-[var(--exit-red)]"
          >
            <FaTrashCan className="h-5 w-5" />
          </button>
          <button
            onClick={handleInspect}
            title="Inspecionar Imagem"
            className="hover:scale-95 text-[var(--system-black)] dark:text-[var(--system-white)]"
          >
            <MdContentPasteSearch className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="mt-1 grid w-full grid-cols-2 gap-2">
        <div className="rounded-xl border border-[var(--light-gray)] px-3 py-1.5 text-center dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
          <div className="text-[11px] leading-none text-[var(--medium-gray)] dark:text-[var(--system-white)]">
            Criado em
          </div>
          <div className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
            {EpochToDateStr(image?.Created)}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--light-gray)] px-3 py-1.5 text-center dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
          <div className="text-[11px] leading-none text-[var(--medium-gray)] dark:text-[var(--system-white)]">
            Há quanto tempo
          </div>
          <div className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
            {FmtAgo(image?.Created)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID da imagem copiado')}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-xs text-[var(--system-black)] transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
        >
          <MdContentCopy className="h-4 w-4" /> Copiar ID
        </button>
        <button
          onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-xs text-[var(--system-black)] transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
        >
          <MdContentCopy className="h-4 w-4" /> Copiar nome:tag
        </button>
      </div>

      {image?.Containers !== -1 && (
        <div className="mt-2 text-xs text-[var(--medium-gray)] dark:text-[var(--system-white)]">
          Containers:{' '}
          <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
            {image?.Containers}
          </span>
        </div>
      )}

      {isInspectOpen && (
        <InspectModal
          title="Inspect da imagem"
          name={`${name}:${tag}`}
          data={inspectContent}
          onClose={() => setIsInspectOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageCard;
