import iziToast from 'izitoast';
import { FaTrashCan } from 'react-icons/fa6';
import { RiFileList2Line } from 'react-icons/ri';
import { useTheme } from '../../../../hooks/use-theme';
import ContainerStatsModal from './ContainerStatsModal';
import ArrowTip from '../../../shared/components/ArrowTip';
import React, { useEffect, useRef, useState } from 'react';
import { FmtName } from '../../../shared/functions/TreatmentFunction';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { ContainerProps } from '../../../../interfaces/ContainerInterfaces';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';
import { MdContentPasteSearch, MdOutlineQueryStats, MdRestartAlt } from 'react-icons/md';
import {
  ContainerRemove,
  ContainerInspect,
  ContainerRestart,
} from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

const ContainersMenuModal: React.FC<ContainerProps> = ({
  id,
  name,
  isOpen,
  onDeleted,
  onOpenLogs,
  setMenuModal,
  onOpenTerminal,
}) => {
  const theme = useTheme();
  const confirmToast = useConfirmToast();
  const { selectedCredentialId } = useDockerClient();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
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

  const handleInspect = async () => {
    try {
      const clientId = ensureClient();
      if (clientId == null) return;
      const inspectContent = await ContainerInspect(clientId, id);
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
  const handleRestart = async () => {
    try {
      const clientId = ensureClient();
      if (clientId == null) return;
      await ContainerRestart(clientId, id);
    } catch (error: any) {
      iziToast.error({ title: 'Erro', message: String(error), position: 'bottomRight' });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setMenuModal(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen, setMenuModal]);

  const handleDelete = () => {
    const clientId = ensureClient();
    if (clientId == null) return;
    confirmToast({
      id,
      title: `Imagem ${name} deletada!`,
      message: `Deseja deletar a imagem: ${name} ?`,
      onConfirm: async () => {
        const clientId = ensureClient();
        if (clientId == null) return;
        await ContainerRemove(clientId, id);
        onDeleted?.();
        setMenuModal?.(false);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute left-full  -top-14 z-20 w-fit-translate-y-1/2 border border-gray-300  rounded-xl shadow-lg"
      role="dialog"
      aria-label="Menu do container"
    >
      <ArrowTip
        position="left"
        size={8}
        color={`#ffffff`}
        offset={0}
      />
      <div
        className="bg-white  rounded-xl shadow-lg p-3 flex flex-col items-stretch gap-2"
        style={{ transformOrigin: 'center left' }}
      >
        <button
          onClick={onOpenLogs}
          title="Logs"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 text-red-600 py-2 px-2 rounded-md"
        >
          <RiFileList2Line className="h-5 w-5" />
          <span className="sm:hidden">Logs</span>
        </button>
        <button
          onClick={handleDelete}
          title="Excluir"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 text-red-600 py-2 px-2 rounded-md"
        >
          <FaTrashCan className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleInspect()}
          title="Inspecionar Container"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdContentPasteSearch className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleRestart()}
          title="Restart Container"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdRestartAlt className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            onOpenTerminal();
            setMenuModal(false);
          }}
          title="Terminal do Container"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <span className="font-mono text-xs border border-current rounded px-1">_&gt;</span>
        </button>
        <button
          onClick={() => {
            const clientId = ensureClient();
            if (clientId == null) return;
            setIsStatsOpen(!isStatsOpen);
          }}
          title="Verificar estatísticas do container"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdOutlineQueryStats className="w-6 h-6" />
        </button>
      </div>
      {isInspectOpen && (
        <InspectModal
          title="Inspect do container"
          name={`${FmtName([name])}`}
          data={inspectContent}
          onClose={() => setIsInspectOpen(false)}
        />
      )}
      {isStatsOpen && (
        <ContainerStatsModal id={id} name={name} onClose={() => setIsStatsOpen(false)} />
      )}
    </div>
  );
};

export default ContainersMenuModal;
