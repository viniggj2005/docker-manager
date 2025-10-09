import React, { useState } from 'react';
import InspectModal from './InspectModal';
import { DockerImageIcon } from '../icons';
import { FaTrashCan, FaTag } from 'react-icons/fa6';
import { confirmToast } from '../utils/ConfirmToast';
import { copyToClipboard } from '../utils/clipboard';
import { RemoveImage } from '../../../wailsjs/go/docker/Docker';
import { MdContentCopy, MdContentPasteSearch } from 'react-icons/md';
import { ImageProps } from '../../interfaces/ContainerImagesInterfaces';
import {
  ParseNameAndTag,
  EpochToDateStr,
  FmtAgo,
  FormatBytes,
} from '../../functions/TreatmentFunction';

const ImageCard: React.FC<ImageProps> = ({ img, onDeleted }) => {
  const id = img.Id ?? '';
  const { name, tag } = ParseNameAndTag(img.RepoTags);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

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

  return (
    <div className="rounded-2xl p-4 transition bg-[var(--system-white)] border border-[var(--light-gray)] hover:border-[var(--light-gray)] flex justify-between">
      <div className="flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--system-white)] border border-[var(--light-gray)]">
            <DockerImageIcon className="text-[var(--docker-blue)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 bg-[var(--system-white)] border border-[var(--light-gray)]">
                <FaTag />
                {tag}
              </span>
              {!img.RepoTags?.length && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] border border-[var(--light-gray)] text-[var(--system-black)]">
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
            className="inline-flex hover:scale-95 items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--system-white)] border border-[var(--light-gray)]"
          >
            <MdContentCopy /> Copiar ID
          </button>

          <button
            onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
            className="inline-flex items-center hover:scale-95 gap-2 px-3 py-1.5 rounded-xl bg-[var(--system-white)] border border-[var(--light-gray)]"
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
          onClick={() => setIsInspectOpen(true)}
          title="Inspecionar Imagem"
          className="cursor-pointer hover:scale-95 text-[var(--system-black)]"
        >
          <MdContentPasteSearch className="w-6 h-6" />
        </button>
      </div>

      {isInspectOpen && (
        <InspectModal id={id} name={`${name}:${tag}`} onClose={() => setIsInspectOpen(false)} />
      )}
    </div>
  );
};

export default ImageCard;
