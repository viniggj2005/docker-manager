import iziToast from 'izitoast';
import { GoPencil } from 'react-icons/go';
import { FiRefreshCw } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';
import { RiFileList2Line } from 'react-icons/ri';
import { CiPlay1, CiPause1 } from 'react-icons/ci';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import React, { useEffect, useRef, useState } from 'react';
import {
  ContainersList,
  ContainerPause,
  ContainerUnPause,
  ContainerRename,
} from '../../../wailsjs/go/docker/Docker';
import LogsModal from './modals/LogsModal';
import ContainersMenuModal from './modals/MenuModal';
import { ContainerItem } from '../../interfaces/ContainerInterface';
import EditContainerNameModal from './modals/EditContainerNameModal';
import ContainersListSkeleton from './skeletons/ContainersListSkeleton';
import { classState, FmtAgo, FmtName } from '../../functions/TreatmentFunction';

const ContainersListView: React.FC = () => {
  const timerRef = useRef<number | null>(null);
  const [items, setItems] = useState<ContainerItem[] | null>(null);
  const [LogsModalId, setLogsModalId] = useState<string | null>(null);
  const [MenuModalId, setMenuModalId] = useState<string | null>(null);
  const [editNameModalId, setEditNameModalId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const resp = await ContainersList();
      setItems(resp || []);
    } catch (e: any) {
      iziToast.error({
        title: 'Erro',
        message: e,
        position: 'bottomRight',
      });
    }
  };

  const handleRename = async (name: string, id: string) => {
    try {
      await ContainerRename(id, name);
      await fetchData();
      setEditNameModalId(null);
    } catch (e: any) {
      iziToast.error({
        title: 'Erro',
        message: e,
        position: 'bottomRight',
      });
    }
  };

  const changeContainerStage = async (id: string, state: string) => {
    try {
      if (state === 'paused') await ContainerUnPause(id);
      else if (state === 'running') await ContainerPause(id);

      await fetchData();
    } catch (e: any) {
      iziToast.error({
        title: 'Erro',
        message: e,
        position: 'bottomRight',
      });
    }
  };

  useEffect(() => {
    fetchData();
    timerRef.current = window.setInterval(fetchData, 2000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-8xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[var(--system-black)]">Containers</h1>
          <button
            onClick={fetchData}
            className="inline-flex items-center hover:scale-95  gap-2 px-3 py-2 rounded-xl transition bg-[var(--system-white)] text-[var(--system-black)] border border-[var(--light-gray)] hover:border-[var(--light-gray)]"
            title="Atualizar"
          >
            <FiRefreshCw className={`h-4 w-4   `} />
            <span>Atualizar</span>
          </button>
        </header>

        {!items ? (
          <ContainersListSkeleton />
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-[var(--light-gray)] bg-[var(--system-white)] p-8 text-center text-[var(--medium-gray)]">
            Nenhum container encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((container) => {
              const name = FmtName(container.Names);
              const isSeeing = LogsModalId === container.Id;
              const isOpened = MenuModalId === container.Id;
              const isEditing = editNameModalId === container.Id;
              return (
                <div
                  key={container.Id}
                  className="group rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="relative w-fit">
                        <div className="inline-block text-xl font-medium text-[var(--system-black)] hover:text-[var(--system-black)] peer">
                          {FmtName(container.Names)}
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => setEditNameModalId(container.Id)}
                            className="absolute -top-1 -right-6 bg-[var(--system-white)] border border-[var(--medium-gray)]
                                          rounded-full p-1 shadow-md hover:bg-[var(--light-gray)]
                                          opacity-0 peer-hover:opacity-100 hover:opacity-100 
                                          transition-opacity duration-150 pointer-events-auto"
                            title="Editar nome"
                          >
                            <GoPencil className="text-[var(--system-black)] w-4 h-4" />
                          </button>
                        )}

                        {isEditing && (
                          <EditContainerNameModal
                            name={name}
                            id={container.Id}
                            handleRename={handleRename}
                            setEditNameModal={() => setEditNameModalId(null)}
                          />
                        )}
                        {isSeeing && (
                          <LogsModal id={container.Id} setLogsModal={() => setLogsModalId(null)} />
                        )}
                      </div>
                      <div className="mt-0.5 text-lg text-[var(--medium-gray)]">
                        {container.Image}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-md font-medium ${classState(
                        container.State
                      )}`}
                      title={container.Status || container.State}
                    >
                      {container.State}
                    </span>
                    <button
                      onClick={() => setLogsModalId(container.Id)}
                      title="Logs"
                      className="rounded-2xl bbg-[var(--system-white)] px-3 py-1.5 text-md text-[var(--exit-red)] hover:scale-95"
                    >
                      <RiFileList2Line className="h-6 w-6" />
                    </button>
                    <button
                      title={`${container.State === 'paused' ? 'Despausar container' : 'Pausar Container'}`}
                      onClick={() => changeContainerStage(container.Id, container.State)}
                      className="rounded-2xl  bg-[var(--system-[var(--system-white)])] px-3 py-1.5 text-sm text-[var(--system-black)] hover:scale-95"
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
                        onClick={() => setMenuModalId(isOpened ? null : container.Id)}
                        className="rounded-2xl  bg-[var(--system-[var(--system-white)])] px-3 py-1.5 text-sm text-[var(--system-black)] hover:scale-95"
                      >
                        <HiOutlineDotsVertical className="w-6 h-6" />
                      </button>
                      {isOpened && (
                        <ContainersMenuModal
                          isOpen={isOpened ? true : false}
                          id={container.Id}
                          name={container.Names?.[0] ?? name}
                          setMenuModal={() => setMenuModalId(null)}
                          onDeleted={async () => {
                            await fetchData();
                            setMenuModalId(null);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-md">
                    <div className="rounded-xl border border-[var(--light-gray)]bg-slate-50 p-3">
                      <div className="text-[14px] uppercase text-[var(--medium-gray)]">Criado</div>
                      <div className="mt-0.5 font-medium text-[var(--dark-gray)]">
                        {FmtAgo(container.Created)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--light-gray)]bg-slate-50 p-3">
                      <div className="text-[14px] uppercase text-[var(--medium-gray)]">Status</div>
                      <div className="mt-0.5 font-medium text-[var(--dark-gray)]">
                        {container.Status || '—'}
                      </div>
                    </div>
                    <div className="col-span-2 rounded-xl border border-[var(--light-gray)]bg-slate-50 p-3">
                      <div className="text-[14px] uppercase text-[var(--medium-gray)]">Portas</div>
                      <div className="mt-0.5 font-mono text-sm text-[var(--dark-gray)]">
                        {container?.Ports?.map((port) => (
                          <span
                            className="flex"
                            key={`${port.IP}-${port.PrivatePort}-${port.Type ?? ''}`}
                          >
                            {port.IP} {port.PrivatePort}&nbsp;
                            <FaLongArrowAltRight />
                            &nbsp;{port.PublicPort}/{port.Type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[14px] text-[var(--medium-gray)]">
                      {container.Id.slice(0, 12)}
                    </div>
                    <div className="opacity-0 transition group-hover:opacity-100">
                      <button
                        className="rounded-xl flex border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm text-[var(--system-black)] hover:scale-95"
                        onClick={() => navigator.clipboard.writeText(container.Id)}
                      >
                        <MdContentCopy /> Copiar ID
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <footer className="mt-6 text-xs text-[var(--medium-gray)]">
          Atualiza a cada 2s. Clique em “Atualizar” para forçar agora.
        </footer>
      </div>
    </div>
  );
};

export default ContainersListView;
