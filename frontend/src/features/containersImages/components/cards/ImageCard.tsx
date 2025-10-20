import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FaTrashCan, FaTag } from 'react-icons/fa6';
import { DockerImageIcon } from '../../../shared/Icons';
import { MdContentCopy, MdContentPasteSearch } from 'react-icons/md';
import { copyToClipboard } from '../../../shared/functions/clipboard';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { ImageProps } from '../../../../interfaces/ContainerImagesInterfaces';
import { confirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { InspectImage, RemoveImage } from '../../../../../wailsjs/go/docker/Docker';
import {
  FmtAgo,
  FormatBytes,
  EpochToDateStr,
  ParseNameAndTag,
} from '../../../shared/functions/TreatmentFunction';

const ImageCard: React.FC<ImageProps> = ({ img, onDeleted }) => {
  const id = img.Id ?? '';
  const { name, tag } = ParseNameAndTag(img.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);

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
      const data = await InspectImage(id);
      setInspectData(data);
      setInspectData(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
      iziToast.success({
        title: 'Sucesso!',
        message: 'Os dados da imagem foram Retornados!',
        position: 'bottomRight',
      });
      console.log('INSPECTDATA', inspectData);
      setIsInspectOpen(true);
    } catch (e: any) {
      iziToast.error({ title: 'Erro', message: String(e), position: 'bottomRight' });
    }
  };

  return (
    <div className="rounded-2xl p-4 transition bg-[var(--system-white)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] flex justify-between">
      <div className="flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--system-white)] dark:bg-[var(--dark-primary)] dark:border-[var(--dark-tertiary)]  border border-[var(--light-gray)]">
            <DockerImageIcon className="text-[var(--docker-blue)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 bg-[var(--system-white)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]">
                <FaTag />
                {tag}
              </span>
              {!img.RepoTags?.length && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] dark:bg-[var(--dark-primary)] border border-[var(--light-gray)] dark:text-[var(--system-white)] text-[var(--system-black)] dark:border-[var(--dark-tertiary)]">
                  dangling
                </span>
              )}
            </div>

            <div className="mt-1 text-sm flex flex-wrap gap-x-4 gap-y-1">
              <span title="Tamanho">{FormatBytes(img.Size)}</span>
              <span title="Criado">
                {EpochToDateStr(img.Created)} <span>({FmtAgo(img.Created)} atrás)</span>
              </span>
              <span title="Containers que usam">{img.Containers === -1 ? '' : img.Containers}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID da imagem copiado')}
            className="inline-flex hover:scale-95 items-center gap-2 px-3 py-1.5 rounded-xl dark:text-[var(--system-white)] bg-[var(--system-white)] dark:bg-[var(--dark-secondary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]"
          >
            <MdContentCopy /> Copiar ID
          </button>

          <button
            onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
            className="inline-flex items-center hover:scale-95 gap-2 px-3 py-1.5 rounded-xl dark:text-[var(--system-white)] bg-[var(--system-white)] dark:bg-[var(--dark-secondary)] border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]"
          >
            <MdContentCopy /> Copiar nome:tag
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end ml-4">
        <button
          onClick={handleDelete}
          title="Excluir"
          className="cursor-pointer hover:scale-95 text-[var(--exit-red)]"
        >
          <FaTrashCan className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            handleInspect();
          }}
          title="Inspecionar Imagem"
          className="cursor-pointer hover:scale-95 text-[var(--system-black)] dark:text-[var(--system-white)]"
        >
          <MdContentPasteSearch className="w-6 h-6" />
        </button>
      </div>

      {isInspectOpen && (
        <InspectModal
          title="Inspect da imagem"
          name={`${name}:${tag}`}
          data={inspectData}
          onClose={() => setIsInspectOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageCard;
