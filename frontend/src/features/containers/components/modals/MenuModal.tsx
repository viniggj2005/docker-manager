import iziToast from 'izitoast';
import { FaTrashCan } from 'react-icons/fa6';
import { useTheme } from '../../../../hooks/use-theme';
import ContainerStatsModal from './ContainerStatsModal';
import ArrowTip from '../../../shared/components/ArrowTip';
import React, { useEffect, useRef, useState } from 'react';
import { FmtName } from '../../../shared/functions/TreatmentFunction';
import InspectModal from '../../../shared/components/modals/InspectModal';
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
  setMenuModal,
}) => {
  const theme = useTheme();
  const confirmToast = useConfirmToast();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectContent, setInspectContent] = useState<string | null>(null);

  const handleInspect = async () => {
    try {
      const inspectContent = await ContainerInspect(id);
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
      await ContainerRestart(id);
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
    confirmToast({
      id,
      title: `Imagem ${name} deletada!`,
      message: `Deseja deletar a imagem: ${name} ?`,
      onConfirm: async () => {
        await ContainerRemove(id);
        onDeleted?.();
        setMenuModal?.(false);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute left-full  -top-14 z-20 w-fit-translate-y-1/2 border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] rounded-xl shadow-lg"
      role="dialog"
      aria-label="Menu do container"
    >
      <ArrowTip
        position="left"
        size={8}
        color={`${theme.theme === 'dark' ? 'var(--dark-secondary)' : 'var(--system-white)'} `}
        offset={14}
      />
      <div
        className="bg-[var(--system-white)] dark:bg-[var(--dark-primary)] rounded-xl shadow-lg p-3 flex flex-col items-stretch gap-2"
        style={{ transformOrigin: 'center left' }}
      >
        <button
          onClick={handleDelete}
          title="Excluir"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 text-[var(--exit-red)] py-2 px-2 rounded-md"
        >
          <FaTrashCan className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleInspect()}
          title="Inspecionar Container"
          className="w-full flex items-center dark:text-[var(--system-white)] justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdContentPasteSearch className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleRestart()}
          title="Restart Container"
          className="w-full flex items-center dark:text-[var(--system-white)] justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdRestartAlt className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsStatsOpen(!isStatsOpen)}
          title="Restart Container"
          className="w-full flex items-center dark:text-[var(--system-white)] justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
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
