import iziToast from 'izitoast';
import { FiBox } from 'react-icons/fi';
import { FaTrashCan } from 'react-icons/fa6';
import React, { useState, useCallback } from 'react';
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

const ImagesTable: React.FC<ImageProps> = ({ image, onDeleted }) => {
  const id = image.Id ?? '';
  const confirmToast = useConfirmToast();
  const { name, tag } = ParseNameAndTag(image.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectContent, setInspectContent] = useState<string | null>(null);

  const handleInspect = useCallback(async () => {
    try {
      const inspectContent = await InspectImage(id);
      const formatted =
        typeof inspectContent === 'string'
          ? inspectContent
          : JSON.stringify(inspectContent, null, 2);
      setInspectContent(formatted);
      setIsInspectOpen(true);
      iziToast.success({
        title: 'Sucesso!',
        message: 'Os dados da imagem foram retornados!',
        position: 'bottomRight',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      iziToast.error({ title: 'Erro', message, position: 'bottomRight' });
    }
  }, [id]);

  const handleRemove = useCallback(() => {
    confirmToast({
      id,
      title: `Imagem ${name}:${tag} deletada!`,
      message: `Deseja deletar a imagem: ${name}:${tag}?`,
      onConfirm: async () => {
        await RemoveImage(id);
        onDeleted?.();
      },
    });
  }, [id, name, tag, onDeleted]);

  return (
    <div>
      <div className="rounded-2xl overflow-hidden dark:text-[var(--system-white)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]">
        <div className="grid grid-cols-12 text-sm px-4 py-2 bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]">
          <div className="col-span-5">Imagem</div>
          <div className="col-span-2">Tamanho</div>
          <div className="col-span-2">Criado</div>
          <div className="col-span-1">Containers</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        <div className="grid grid-cols-12 items-center px-4 py-2 text-md bg-[var(--system-white)] dark:bg-[var(--dark-primary)] hover:bg-[var(--light-gray)] dark:hover:bg-[var(--dark-tertiary)]">
          <div className="col-span-5 flex items-center gap-2 min-w-0">
            <FiBox className="h-4 w-4 text-[var(--system-black)] dark:text-[var(--system-white)]" />
            <span className="truncate font-light">{name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]">
              {tag}
            </span>
            {!image.RepoTags?.length && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] text-[var(--system-black)] dark:text-[var(--system-white)]">
                dangling
              </span>
            )}
          </div>

          <div className="col-span-2 text-[var(--system-black)] dark:text-[var(--system-white)]">
            {FormatBytes(image.Size)}
          </div>

          <div
            className="col-span-2 text-[var(--system-black)] dark:text-[var(--system-white)]"
            title={EpochToDateStr(image.Created)}
          >
            {FmtAgo(image.Created)} atrás
          </div>

          <div className="col-span-1 text-[var(--system-black)] dark:text-[var(--system-white)]">
            {image.Containers === -1 ? 'Info. não encontrada!' : image.Containers}
          </div>

          <div className="col-span-2 flex items-center gap-2 justify-end">
            <button
              onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID copiado')}
              title="Copiar ID da Imagem"
              className="px-2 py-1 hover:scale-90 rounded-lg"
            >
              <MdContentCopy />
            </button>

            <button
              onClick={handleInspect}
              title="Inspecionar Imagem"
              className="px-2 py-1 hover:scale-90 rounded-lg"
            >
              <MdContentPasteSearch />
            </button>

            <button
              onClick={handleRemove}
              title="Excluir imagem"
              className="px-2 py-1 hover:scale-90 rounded-lg"
            >
              <FaTrashCan className="text-[var(--exit-red)]" />
            </button>
          </div>
        </div>
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

export default ImagesTable;
