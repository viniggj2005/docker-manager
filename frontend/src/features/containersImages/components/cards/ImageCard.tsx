import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FaTrashCan, FaTag } from 'react-icons/fa6';
import { DockerImageIcon } from '../../../shared/Icons';
import { MdContentCopy, MdContentPasteSearch } from 'react-icons/md';
import { copyToClipboard } from '../../../shared/functions/clipboard';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { ImageProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { InspectImage, RemoveImage } from '../../../../../wailsjs/go/docker/Docker';
import {
  FmtAgo,
  FormatBytes,
  EpochToDateStr,
  ParseNameAndTag,
} from '../../../shared/functions/TreatmentFunction';

const ImageCard: React.FC<ImageProps> = ({ image, onDeleted }) => {
  const id = image.Id ?? '';
  const confirmToast = useConfirmToast();
  const { name, tag } = ParseNameAndTag(image.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectContent, setInspectContent] = useState<string | null>(null);

  const handleDelete = () => {
    confirmToast({
      id: id,
      title: `Imagem ${name}:${tag} deletada!`,
      message: `Deseja deletar a imagem: ${name}:${tag} ?`,
      onConfirm: async () => {
        await RemoveImage(id);
        onDeleted?.();
      },
    });
  };

  const handleInspect = async () => {
    try {
      const inspectContent = await InspectImage(id);
      setInspectContent(inspectContent);
      setInspectContent(
        typeof inspectContent === 'string'
          ? inspectContent
          : JSON.stringify(inspectContent, null, 2)
      );
      iziToast.success({
        title: 'Sucesso!',
        message: 'Os dados da imagem foram Retornados!',
        position: 'bottomRight',
      });
      setIsInspectOpen(true);
    } catch (error: any) {
      iziToast.error({ title: 'Erro', message: String(error), position: 'bottomRight' });
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-4 transition dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex items-center justify-center rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] p-2 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
            <DockerImageIcon className="text-[var(--docker-blue)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-semibold">{name}</span>
              <span className="flex items-center gap-1 rounded-full border border-[var(--light-gray)] bg-[var(--system-white)] px-2 py-0.5 text-xs dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
                <FaTag />
                {tag}
              </span>
              {!image.RepoTags?.length && (
                <span className="rounded-full border border-[var(--light-gray)] bg-[var(--system-white)] px-2 py-0.5 text-xs text-[var(--system-black)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]">
                  dangling
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span title="Tamanho">{FormatBytes(image.Size)}</span>
              <span title="Criado">
                {EpochToDateStr(image.Created)} <span>({FmtAgo(image.Created)} atrás)</span>
              </span>
              <span title="Containers que usam">{image.Containers === -1 ? '' : image.Containers}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-48 md:w-auto md:flex-row md:items-start md:justify-end">
          <button
            onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID da imagem copiado')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] md:w-auto"
          >
            <MdContentCopy /> Copiar ID
          </button>

          <button
            onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)] md:w-auto"
          >
            <MdContentCopy /> Copiar nome:tag
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleDelete}
          title="Excluir"
          className="flex items-center justify-center text-[var(--exit-red)] transition hover:scale-95"
        >
          <FaTrashCan className="h-5 w-5" />
        </button>

        <button
          onClick={handleInspect}
          title="Inspecionar Imagem"
          className="flex items-center justify-center text-[var(--system-black)] transition hover:scale-95 dark:text-[var(--system-white)]"
        >
          <MdContentPasteSearch className="h-6 w-6" />
        </button>
      </div>

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
