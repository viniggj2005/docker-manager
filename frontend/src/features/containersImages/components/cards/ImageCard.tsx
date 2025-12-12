import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FaTag } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
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
    <div className="border border-gray-200 bg-white text-black   rounded-lg p-4  hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-50  rounded-lg flex items-center justify-center flex-shrink-0">
            <DockerImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate mb-1 ">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100  text-blue-800 dark:text-blue-400 rounded text-xs">
                <FaTag className="w-3 h-3" /> {tag}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleInspect}
            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
            title="Inspecionar imagem"
          >
            <MdContentPasteSearch className="w-4 h-4 text-blue-600 " />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-50  rounded transition-colors"
            title="Remover imagem"
          >
            <FaRegTrashAlt className="w-4 h-4 text-red-600 " />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 ">Tamanho</span>
          <span className="text-gray-900 ">{FormatBytes(image?.Size || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 ">Criado</span>
          <span className="text-gray-900 text-xs">{EpochToDateStr(image?.Created)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 ">Há quanto tempo</span>
          <span className="text-gray-900 text-xs">{FmtAgo(image?.Created)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-300 ">
        <button
          onClick={() => copyToClipboard(id.replace('sha256:', ''), 'ID da imagem copiado')}
          className="flex-1 px-3 py-1.5 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1 "
        >
          <MdContentCopy className="w-3 h-3" />
          Copiar ID
        </button>
        <button
          onClick={() => copyToClipboard(`${name}:${tag}`, 'Nome:tag copiado')}
          className="flex-1 px-3 py-1.5 border border-gray-400 rounded-lg hover:bg-gray-50  transition-colors text-sm flex items-center justify-center gap-1 "
        >
          <MdContentCopy className="w-3 h-3" />
          Copiar nome:tag
        </button>
      </div>

      {
        isInspectOpen && (
          <InspectModal
            title="Inspect da imagem"
            name={`${name}:${tag}`}
            data={inspectContent}
            onClose={() => setIsInspectOpen(false)}
          />
        )
      }
    </div >
  );
};

export default ImageCard;
