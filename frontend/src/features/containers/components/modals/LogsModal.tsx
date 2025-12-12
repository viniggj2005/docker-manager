import iziToast from 'izitoast';
import { FiSearch } from 'react-icons/fi';
import 'izitoast/dist/css/iziToast.min.css';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import React, { useEffect, useRef, useState } from 'react';
import { LogsProps } from '../../../../interfaces/ContainerInterfaces';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { ContainerLogs } from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

const LogsModal: React.FC<LogsProps> = ({ id, setLogsModal }) => {
  const firstScrollDone = useRef(false);
  const [filter, setFilter] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [containerLogs, setContainerLogs] = useState<string>('');
  const { selectedCredentialId } = useDockerClient();

  useEffect(() => {
    (async () => {
      if (selectedCredentialId == null) {
        iziToast.error({
          title: 'Credencial não selecionada',
          message: 'Escolha uma credencial Docker para visualizar os logs.',
          position: 'bottomRight',
        });
        setLogsModal(false);
        return;
      }
      try {
        const containerLogs = await ContainerLogs(selectedCredentialId, id);
        iziToast.success({
          message: 'Logs buscados com sucesso!',
          position: 'bottomRight',
        });
        setContainerLogs(containerLogs ?? '');
      } catch (error: any) {
        iziToast.error({
          title: 'Erro',
          message: error?.message ?? String(error),
          position: 'bottomRight',
        });
      }
    })();
  }, [id, selectedCredentialId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || firstScrollDone.current) return;
    if (containerLogs) {
      el.scrollTop = el.scrollHeight;
      firstScrollDone.current = true;
    }
  }, [containerLogs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLogsModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setLogsModal]);

  const display = filter
    ? containerLogs
      .split(/<br\s*\/?>/i)
      .filter((line) => line.toLowerCase().includes(filter.toLowerCase()))
      .join('<br>')
    : containerLogs;

  const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setLogsModal(false);
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/60  dark:bg-black/60 backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div className="relative w-[min(90vw,900px)] h-[min(80vh,650px)] rounded-2xl border border-gray-300 bg-white dark:border-white/10 dark:bg-zinc-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-gray-300 dark:border-white/10 px-5 py-3 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-medium">Logs do contêiner</h2>
            <span className="text-xs text-zinc-400">#{id.slice(0, 12)}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-70" />
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filtrar"
                className="pl-7 pr-3 py-1.5 text-sm dark:bg-zinc-800 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              />
            </div>
            <button
              onClick={() => setLogsModal(false)}
              className="
                                    inline-flex h-6 w-6 items-center justify-center
                                    rounded-full
                                    text-red-600
                                    hover:bg-red-600 hover:text-white hover:scale-95
                                    transition
                                  "
              aria-label="Fechar"
            >
              <IoMdCloseCircleOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[calc(100%-52px)] overflow-y-auto px-5 py-4 font-mono text-xs"
          dangerouslySetInnerHTML={{ __html: display }}
        />
      </div>
    </div>
  );
};

export default LogsModal;
