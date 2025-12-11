import React, { useState } from 'react';
import { GoPencil } from 'react-icons/go';
import InfoTile from '../badges/InfoTile';
import { CgSpinner } from 'react-icons/cg';
import LogsModal from '../modals/LogsModal';
import CardFooter from './ContainerCardFooter';
import StatusBadge from '../badges/StatusBadge';
import PortsList from '../../../ports/PortsList';
import { RiFileList2Line } from 'react-icons/ri';
import ContainersMenuModal from '../modals/MenuModal';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { CiPlay1, CiPause1, CiStop1 } from 'react-icons/ci';
import { FmtAgo } from '../../../shared/functions/TreatmentFunction';
import EditContainerNameModal from '../modals/EditContainerNameModal';
import { ContainerCardProps } from '../../../../interfaces/ContainerInterfaces';

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
    <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="relative max-w-full pr-7">
            <div className="truncate text-xl font-medium transition hover:scale-[0.99]">
              {name}
            </div>

            {!isEditing && (
              <button
                onClick={onOpenEdit}
                className="absolute -top-1 right-0 rounded-full border border-[var(--medium-gray)] bg-[var(--system-white)] p-1 shadow-md opacity-0 transition group-hover:opacity-100 hover:bg-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
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
            className="mt-1 truncate text-md text-[var(--medium-gray)]"
          >
            {container.Image}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex-shrink-0">
            <StatusBadge state={container.State} title={container.Status || container.State} />
          </div>

          <button
            onClick={onOpenLogs}
            title="Logs"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--exit-red)] transition hover:scale-95 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
          >
            <RiFileList2Line className="h-5 w-5" />
            <span className="sm:hidden">Logs</span>
          </button>

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
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium transition hover:scale-95 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] ${container.State === 'running'
              ? 'text-[var(--exit-red)]'
              : 'text-[var(--success-green)]'
              }`}
          >
            {loading ? (
              <CgSpinner className="h-5 w-5 animate-spin text-[var(--system-black)] dark:text-[var(--system-white)]" />
            ) : container.State === 'running' ? (
              <CiStop1 className="h-5 w-5" />
            ) : (
              <CiPlay1 className="h-5 w-5" />
            )}
            <span className="sm:hidden">
              {loading ? 'Carregando' : container.State === 'running' ? 'Parar' : 'Iniciar'}
            </span>
          </button>

          <button
            title={container.State === 'paused' ? 'Despausar container' : 'Pausar Container'}
            onClick={() => onTogglePause(container.Id, container.State)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--system-black)] transition hover:scale-95 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
          >
            {container.State === 'paused' ? (
              <CiPlay1 className="h-5 w-5" />
            ) : (
              <CiPause1 className="h-5 w-5" />
            )}
            <span className="sm:hidden">
              {container.State === 'paused' ? 'Iniciar' : 'Pausar'}
            </span>
          </button>

          <div className="relative w-full sm:w-auto">
            <button
              title="menu"
              onClick={() => (isOpened ? onCloseMenu() : onOpenMenu())}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--system-black)] transition hover:scale-95 dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
            >
              <HiOutlineDotsVertical className="h-5 w-5" />
              <span className="sm:hidden">Ações</span>
            </button>
            {isOpened && (
              <ContainersMenuModal
                isOpen={!!isOpened}
                id={container.Id}
                name={container.Names?.[0] ?? name}
                setMenuModal={onCloseMenu}
                onDeleted={onDeleted}
                onOpenTerminal={onOpenTerminal}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-md">
        <InfoTile label="Criado">
          <span className="mt-0.5 font-medium ">{FmtAgo(container.Created)}</span>
        </InfoTile>

        <InfoTile label="Status">
          <span className="mt-0.5 font-medium ">{container.Status || '—'}</span>
        </InfoTile>

        <InfoTile label="Portas" full>
          <div className="max-h-32 overflow-y-auto">
            <PortsList ports={container?.Ports} />
          </div>
        </InfoTile>
      </div>

      <CardFooter id={container.Id} />
    </div>
  );
};

export default ContainerCard;
