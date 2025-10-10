import iziToast from 'izitoast';
import ArrowTip from '../utils/ArrowTip';
import { FaTrashCan } from 'react-icons/fa6';
import InspectModal from '../utils/InspectModal';
import { confirmToast } from '../utils/ConfirmToast';
import React, { useEffect, useRef, useState } from 'react';
import { FmtName } from '../../functions/TreatmentFunction';
import { MdContentPasteSearch, MdRestartAlt } from 'react-icons/md';
import { ContainerProps } from '../../interfaces/ContainerInterface';
import {
  ContainerInspect,
  ContainerRemove,
  ContainerRestart,
} from '../../../wailsjs/go/docker/Docker';

const ContainersMenuModal: React.FC<ContainerProps> = ({
  id,
  name,
  isOpen,
  onDeleted,
  setMenuModal,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);

  const handleInspect = async () => {
    try {
      const data = await ContainerInspect(id);
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
  const handleRestart = async () => {
    try {
      await ContainerRestart(id);
    } catch (e: any) {
      iziToast.error({ title: 'Erro', message: String(e), position: 'bottomRight' });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setMenuModal(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen, setMenuModal]);

  const handleDelete = () => {
    confirmToast({
      id: id,
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
      className="absolute left-full  -top-14 z-20 w-fit-translate-y-1/2 border border-[var(--light-gray)] rounded-xl shadow-lg"
      role="dialog"
      aria-label="Menu do container"
    >
      <ArrowTip position="left" size={8} color="var(--system-white)" offset={14} />
      <div
        className="bg-[var(--system-white)] rounded-xl shadow-lg p-3 flex flex-col items-stretch gap-2"
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
      </div>
      {isInspectOpen && (
        <InspectModal
          title="Inspect do container"
          name={`${FmtName([name])}`}
          data={inspectData}
          onClose={() => setIsInspectOpen(false)}
        />
      )}
    </div>
  );
};

export default ContainersMenuModal;
