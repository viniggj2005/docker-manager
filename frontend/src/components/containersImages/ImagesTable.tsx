import React from 'react';
import { FiBox } from 'react-icons/fi';
import { FaTrashCan } from 'react-icons/fa6';
import { MdContentCopy } from 'react-icons/md';
import { copyToClipboard } from '../utils/clipboard';
import { confirmToast } from '../utils/ConfirmToast';
import { RemoveImage } from '../../../wailsjs/go/docker/Docker';
import { DockerImageInfo } from '../../interfaces/ContainerImagesInterfaces';
import {
  ParseNameAndTag,
  FmtAgo,
  FormatBytes,
  EpochToDateStr,
} from '../../functions/TreatmentFunction';

interface Props {
  images: DockerImageInfo[];
  onDeleted?: () => void;
}

const ImagesTable: React.FC<Props> = ({ images, onDeleted }) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--light-gray)]">
      <div className="grid grid-cols-12 text-sm px-4 py-2 bg-[var(--system-white)] border-b border-[var(--light-gray)]">
        <div className="col-span-5">Imagem</div>
        <div className="col-span-2">Tamanho</div>
        <div className="col-span-2">Criado</div>
        <div className="col-span-1">Containers</div>
        <div className="col-span-2 text-right">Ações</div>
      </div>

      {images.map((img) => {
        const { name, tag } = ParseNameAndTag(img.RepoTags);
        const id = img.Id ?? Math.random().toString(36);
        return (
          <div
            key={id}
            className="grid grid-cols-12 items-center px-4 py-2 text-sm border-b border-[var(--dark-gray)] hover:bg-[var(--system-white)]"
          >
            <div className="col-span-5 flex items-center gap-2 min-w-0">
              <FiBox className="h-4 w-4 text-[var(--system-black)]" />
              <span className="truncate font-light">{name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] border border-[var(--light-gray)]">
                {tag}
              </span>
              {!img.RepoTags?.length && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--system-white)] border border-[var(--light-gray)] text-[var(--system-black)]">
                  dangling
                </span>
              )}
            </div>

            <div className="col-span-2 text-[var(--system-black)]">{FormatBytes(img.Size)}</div>

            <div
              className="col-span-2 text-[var(--system-black)]"
              title={EpochToDateStr(img.Created)}
            >
              {FmtAgo(img.Created)} atrás
            </div>

            <div className="col-span-1 text-[var(--system-black)]">
              {img.Containers === -1 ? 'Info. não encontrada!' : img.Containers}
            </div>

            <div className="col-span-2 flex items-center gap-2 justify-end">
              <button
                onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID copiado')}
                title="Copiar Id da Imagem"
                className="px-2 py-1 rounded-lg bg-[var(--system-white)] border border-[var(--light-gray)] hover:border-[var(--accent-green)]"
              >
                <MdContentCopy />
              </button>

              <button
                onClick={() =>
                  confirmToast({
                    id,
                    title: `Imagem ${name}:${tag} deletada!`,
                    message: `Deseja deletar a imagem: ${name}:${tag} ?`,
                    onConfirm: async () => {
                      await RemoveImage(id);
                      onDeleted?.();
                    },
                  })
                }
                title="Excluir imagem"
                className="px-2 py-1 rounded-lg bg-[var(--system-white)] border border-[var(--light-gray)] hover:border-[var(--accent-green)]"
              >
                <FaTrashCan className="text-[var(--exit-red)]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesTable;
