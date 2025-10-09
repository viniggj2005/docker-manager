import { FaTrashCan } from 'react-icons/fa6';
import React, { useEffect, useRef } from 'react';
import { confirmToast } from '../utils/ConfirmToast';
import { ContainerProps } from '../../interfaces/ContainerInterface';
import ArrowTip from '../utils/ArrowTip';
import { MdContentPasteSearch } from 'react-icons/md';
import { ContainerRemove } from '../../../wailsjs/go/docker/Docker';
const ContainersMenuModal: React.FC<ContainerProps> = ({
  id,
  name,
  isOpen,
  onDeleted,
  setMenuModal,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

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
      className="absolute left-full ml-2 -top-1/2 z-20 w-fit-translate-y-1/2 border border-[var(--light-gray)] rounded-xl shadow-lg"
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
          // onClick={() => setIsInspectOpen(true)}
          title="Inspecionar Container"
          className="w-full flex items-center justify-start gap-2 cursor-pointer hover:scale-95 py-2 px-2 rounded-md"
        >
          <MdContentPasteSearch className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ContainersMenuModal;
