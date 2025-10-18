import React from 'react';
import CardFooter from './CardFooter';
import InfoTile from '../badges/InfoTile';
import { GoPencil } from 'react-icons/go';
import LogsModal from '../modals/LogsModal';
import PortsList from '../../ports/PortsList';
import StatusBadge from '../badges/StatusBadge';
import { RiFileList2Line } from 'react-icons/ri';
import { CiPlay1, CiPause1 } from 'react-icons/ci';
import ContainersMenuModal from '../modals/MenuModal';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FmtAgo } from '../../../functions/TreatmentFunction';
import EditContainerNameModal from '../modals/EditContainerNameModal';
import { ContainerItem } from '../../../interfaces/ContainerInterfaces';

type Props = {
  container: ContainerItem;
  name: string;
  isSeeing: boolean;
  isOpened: boolean;
  isEditing: boolean;
  onOpenLogs: () => void;
  onOpenMenu: () => void;
  onOpenEdit: () => void;
  onCloseLogs: () => void;
  onCloseMenu: () => void;
  onCloseEdit: () => void;
  onDeleted: () => Promise<void>;
  onRename: (name: string, id: string) => Promise<void>;
  onTogglePause: (id: string, state: string) => Promise<void>;
};

const ContainerCard: React.FC<Props> = ({
  name,
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
}) => {
  return (
    <div className="group rounded-2xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="relative w-fit">
            <div className="inline-block text-xl font-medium text-[var(--system-black)] hover:scale-95 dark:text-[var(--system-white)] peer">
              {name}
            </div>

            {!isEditing && (
              <button
                onClick={onOpenEdit}
                className="absolute -top-1 -right-6 bg-[var(--system-white)] dark:bg-[var(--dark-primary)]
                 border border-[var(--medium-gray)] dark:border-[var(--dark-tertiary)]
                          rounded-full p-1 shadow-md hover:bg-[var(--light-gray)]
                          opacity-0 peer-hover:opacity-100 hover:opacity-100 
                          transition-opacity duration-150 pointer-events-auto"
                title="Editar nome"
              >
                <GoPencil className="text-[var(--system-black)] dark:text-[var(--system-white)] w-4 h-4" />
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

          <div className="mt-0.5 text-lg text-[var(--medium-gray)] ">{container.Image}</div>
        </div>

        <StatusBadge state={container.State} title={container.Status || container.State} />

        <button
          onClick={onOpenLogs}
          title="Logs"
          className="rounded-2xl bg-[var(--system-white)] dark:bg-[var(--dark-primary)] px-3 py-1.5 text-md text-[var(--exit-red)] hover:scale-95"
        >
          <RiFileList2Line className="h-6 w-6" />
        </button>

        <button
          title={`${container.State === 'paused' ? 'Despausar container' : 'Pausar Container'}`}
          onClick={() => onTogglePause(container.Id, container.State)}
          className="rounded-2xl  bg-[var(--system-white)] dark:bg-[var(--dark-primary)] px-3 py-1.5 text-sm dark:text-[var(--system-white)] text-[var(--system-black)] hover:scale-95"
        >
          {container.State === 'paused' ? (
            <CiPlay1 className="w-6 h-6" />
          ) : (
            <CiPause1 className="w-6 h-6" />
          )}
        </button>

        <div className="relative">
          <button
            title="menu"
            onClick={() => (isOpened ? onCloseMenu() : onOpenMenu())}
            className="rounded-2xl  bg-[var(--system-white)] dark:bg-[var(--dark-primary)] px-3 py-1.5 text-sm dark:text-[var(--system-white)] text-[var(--system-black)] hover:scale-95"
          >
            <HiOutlineDotsVertical className="w-6 h-6" />
          </button>
          {isOpened && (
            <ContainersMenuModal
              isOpen={!!isOpened}
              id={container.Id}
              name={container.Names?.[0] ?? name}
              setMenuModal={onCloseMenu}
              onDeleted={onDeleted}
            />
          )}
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
          <PortsList ports={container?.Ports} />
        </InfoTile>
      </div>

      <CardFooter id={container.Id} />
    </div>
  );
};

export default ContainerCard;
