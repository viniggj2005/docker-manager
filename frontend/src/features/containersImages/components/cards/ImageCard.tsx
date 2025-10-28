import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FaTrashCan, FaTag } from 'react-icons/fa6';
import { DockerImageIcon } from '../../../shared/Icons';
import { MdContentCopy, MdContentPasteSearch } from 'react-icons/md';
import { copyToClipboard } from '../../../shared/functions/clipboard';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { ImageProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import {
  InspectImage,
  RemoveImage,
} from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';
import {
  FmtAgo,
  FormatBytes,
  EpochToDateStr,
  ParseNameAndTag,
} from '../../../shared/functions/TreatmentFunction';
import { useDockerClient } from '../../../../contexts/DockerClientContext';

const ImageCard: React.FC<ImageProps> = ({ image, onDeleted }) => {
  const id = image?.Id ?? '';
  const confirmToast = useConfirmToast();
  const { name, tag } = ParseNameAndTag(image?.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectContent, setInspectContent] = useState<string | null>(null);
  const { selectedCredentialId } = useDockerClient();

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
      className="group min-w-[350px] mx-auto max-w-[840px] sm:max-w-[1040px] md:max-w-[1240px] lg:max-w-[1480px]
                 flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md
                 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
    >
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-start gap-3">
          <div className="p-2 rounded-xl border border-[var(--light-gray)] shrink-0 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
            <DockerImageIcon className="w-6 h-6 text-[var(--docker-blue)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="min-w-0 flex items-start gap-2">
              <span
                title={name}
                className="flex-1 min-w-0 pe-2 text-lg font-medium leading-tight whitespace-normal break-words text-[var(--system-black)] dark:text-[var(--system-white)]"
              >
                {name}
              </span>

              <span className="shrink-0 mr-1 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-[var(--light-gray)] bg-[var(--system-white)] text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
                <FaTag /> {tag}
              </span>

              {!image?.RepoTags?.length && (
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full border border-[var(--light-gray)] text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:text-[var(--system-white)]">
                  dangling
                </span>
              )}
            </div>

            <div className="mt-1 text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
              {FormatBytes(image?.Size || 0)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDelete}
            title="Excluir"
            className="hover:scale-95 text-[var(--exit-red)]"
          >
            <FaTrashCan className="w-5 h-5" />
          </button>
          <button
            onClick={handleInspect}
            title="Inspecionar Imagem"
            className="hover:scale-95 text-[var(--system-black)] dark:text-[var(--system-white)]"
          >
            <MdContentPasteSearch className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Datas */}
      <div className="mt-1 grid grid-cols-2 gap-2 w-full">
        <div className="rounded-xl border border-[var(--light-gray)] px-3 py-1.5 text-center dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
          <div className="text-[11px] text-[var(--medium-gray)] leading-none dark:text-[var(--system-white)]">
            Criado em
          </div>
          <div className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
            {EpochToDateStr(image?.Created)}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--light-gray)] px-3 py-1.5 text-center dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
          <div className="text-[11px] text-[var(--medium-gray)] leading-none dark:text-[var(--system-white)]">
            Há quanto tempo
          </div>
          <div className="text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
            {FmtAgo(image?.Created)}
          </div>
        </div>
      </div>

      {/* Ações: copiar — CENTRALIZADO */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 w-full">
        <button
          onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID da imagem copiado')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[var(--light-gray)] text-xs bg-[var(--system-white)] text-[var(--system-black)] transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
        >
          <MdContentCopy className="w-4 h-4" /> Copiar ID
        </button>
        <button
          onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[var(--light-gray)] text-xs bg-[var(--system-white)] text-[var(--system-black)] transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
        >
          <MdContentCopy className="w-4 h-4" /> Copiar nome:tag
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
