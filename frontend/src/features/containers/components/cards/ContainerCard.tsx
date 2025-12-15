import React, { useState } from 'react';
import { GoPencil } from 'react-icons/go';
import { CgSpinner } from 'react-icons/cg';
import LogsModal from '../modals/LogsModal';
import CardFooter from './ContainerCardFooter';
import StatusBadge from '../badges/StatusBadge';
import { IoCopyOutline } from "react-icons/io5";
import ContainersMenuModal from '../modals/MenuModal';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { CiPlay1, CiPause1, CiStop1 } from 'react-icons/ci';
import { FmtAgo } from '../../../shared/functions/TreatmentFunction';
import EditContainerNameModal from '../modals/EditContainerNameModal';
import { ContainerCardProps } from '../../../../interfaces/ContainerInterfaces';
import { FaLongArrowAltRight } from 'react-icons/fa';

const ContainerCard: React.FC<ContainerCardProps> = ({
  name,
  onStop,
  onStart,
  onRename,
  isSeeing,
  isOpened,
  container,
  isEditing,
  onDeleted,
  onOpenLogs,
  onOpenMenu,
  onOpenEdit,
  onCloseLogs,
  onCloseMenu,
  onCloseEdit,
  onTogglePause,
  onOpenTerminal,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-5 shadow-sm transition hover:shadow-md text-black  ">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="relative max-w-full pr-7">
            <div className="truncate text-xl font-medium transition hover:scale-[0.99]">
              {name}
            </div>

            {!isEditing && (
              <button
                onClick={onOpenEdit}
                className="absolute -top-1 right-0 rounded-full border border-gray-500 bg-white p-1 shadow-md opacity-0 transition group-hover:opacity-100 hover:bg-gray-100"
                title="Editar nome"
              >
                <GoPencil className="h-4 w-4" />
              </button>
            )}

            {isEditing && (
              <EditContainerNameModal
                name={name}
                id={container.Id}
                handleRename={onRename}
                setEditNameModal={onCloseEdit}
              />
            )}

            {isSeeing && <LogsModal id={container.Id} setLogsModal={onCloseLogs} />}
          </div>

          <div
            title="Imagem Docker"
            className="mt-1 truncate text-md text-gray-500"
          >
            {container.Image}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex-shrink-0">
            <StatusBadge state={container.State} title={container.Status || container.State} />
          </div>

          <button
            disabled={loading}
            title={container.State === 'running' ? 'Parar Container' : 'Iniciar Container'}
            onClick={async () => {
              setLoading(true);
              try {
                if (container.State === 'running') await onStop(container.Id);
                else await onStart(container.Id);
              } finally {
                setLoading(false);
              }
            }}
            className={` p-1.5 rounded transition-colors scale-95 ${container.State === 'running'
              ? 'text-red-600 hover:bg-red-200'
              : 'text-emerald-500 hover:bg-emerald-200'
              }`}
          >
            {loading ? (
              <CgSpinner className="h-4 w-4 animate-spin text-black dark:text-white" />
            ) : container.State === 'running' ? (
              <CiStop1 className="h-4 w-4" />
            ) : (
              <CiPlay1 className="h-4 w-4" />
            )}
            <span className="sm:hidden">
              {loading ? 'Carregando' : container.State === 'running' ? 'Parar' : 'Iniciar'}
            </span>
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded transition-colors scale-95"
            onClick={() => navigator.clipboard.writeText(container.Id)}
            title='Copiar ID'
          >
            <IoCopyOutline className="h-4 w-4" />
          </button>

          <button
            title={container.State === 'paused' ? 'Despausar container' : 'Pausar Container'}
            onClick={() => onTogglePause(container.Id, container.State)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors scale-95"
          >
            {container.State === 'paused' ? (
              <CiPlay1 className="h-4 w-4" />
            ) : (
              <CiPause1 className="h-4 w-4" />
            )}
            <span className="sm:hidden">
              {container.State === 'paused' ? 'Iniciar' : 'Pausar'}
            </span>
          </button>

          <div className="relative w-full sm:w-auto">
            <button
              title="menu"
              onClick={() => (isOpened ? onCloseMenu() : onOpenMenu())}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors scale-95"
            >
              <HiOutlineDotsVertical className="h-4 w-4" />
              <span className="sm:hidden">Ações</span>
            </button>
            {isOpened && (
              <ContainersMenuModal
                id={container.Id}
                isOpen={!!isOpened}
                onDeleted={onDeleted}
                onOpenLogs={onOpenLogs}
                setMenuModal={onCloseMenu}
                onOpenTerminal={onOpenTerminal}
                name={container.Names?.[0] ?? name}
              />
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Criado</p>
            <p className="text-sm">{FmtAgo(container.Created)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm">{container.Status || '—'}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Portas</p>
          <div className="space-y-1">
            {container?.Ports?.map((port) => (
              <div key={`${port.IP}-${port.PrivatePort}-${port.Type ?? ''}`} className="flex items-center gap-2 text-xs font-mono  whitespace-nowrap">
                <span>{port.IP} {port.PrivatePort}</span>
                <FaLongArrowAltRight />
                <span>{port.PublicPort}/{port.Type}</span>
              </div>
            ))}
          </div>
        </div>

        <CardFooter id={container.Id} />
      </div>
    </div>
  );
};

export default ContainerCard;
