import { CPUChart } from '../charts/CpuChart';
import { MemoryChart } from '../charts/MemoryChart';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { EventsOn } from '../../../../../wailsjs/runtime/runtime';
import { BytesToMB } from '../../../shared/functions/TreatmentFunction';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ContainerStatsProps, StatsPayload } from '../../../../interfaces/ContainerInterfaces';
import { StartContainerStats, StopContainerStats } from '../../../../../wailsjs/go/docker/Docker';

const MAX_POINTS = 10;

const ContainerStatsModal: React.FC<ContainerStatsProps> = ({ id, name, onClose }) => {
  const memLimitMBRef = useRef<number | null>(null);
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [cpuSeries, setCpuSeries] = useState<{ t: number; v: number }[]>([]);
  const [memPctSeries, setMemPctSeries] = useState<{ t: number; v: number }[]>([]);
  const [memUsageMBSeries, setMemUsageMBSeries] = useState<{ t: number; v: number }[]>([]);

  useEffect(() => {
    const offStats = EventsOn('container:stats', (p: StatsPayload) => {
      if (p.containerId !== id) return;
      setStats(p);

      const t = new Date(p.time).getTime();
      setCpuSeries((s) => {
        const next = [...s, { t, v: Number(p.cpuPercent) }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });
      setMemPctSeries((s) => {
        const next = [...s, { t, v: Number(p.memPercent) }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });
      setMemUsageMBSeries((s) => {
        const next = [...s, { t, v: BytesToMB(p.memUsage) }];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });
      if (!memLimitMBRef.current) memLimitMBRef.current = BytesToMB(p.memLimit);
    });

    const offErr = EventsOn('container:stats:error', (e: any) => {
      if (e?.containerId === id) console.error('stats error:', e.error);
    });

    StartContainerStats(id);

    return () => {
      StopContainerStats(id);
      offStats();
      offErr();
    };
  }, [id]);

  const header = useMemo(() => {
    if (!stats) return null;
    const mb = (n: number) => (n / (1024 * 1024)).toFixed(1);
    return {
      cpu: stats.cpuPercent.toFixed(1),
      memUsage: mb(stats.memUsage),
      memLimit: mb(stats.memLimit),
      memPct: stats.memPercent.toFixed(1),
      rx: mb(stats.rxBytes),
      tx: mb(stats.txBytes),
      pids: stats.pids,
      t: new Date(stats.time),
    };
  }, [stats]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--light-overlay)]  dark:bg-[var(--dark-overlay)] backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-fit h-fit bg-[var(--system-white)]
         rounded-2xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] 
         dark:bg-[var(--dark-primary)] shadow-2xl dark:text-[var(--system-white)]"
      >
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-5 py-3 dark:bg-[var(--dark-primary)]">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-medium">Métricas do contêiner</h2>
            <span className="text-xs text-[var(--grey-text)] ">#{name}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="ml-1 text-[var(--light-red)] hover:scale-95"
              title="Fechar"
            >
              <IoMdCloseCircleOutline className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-rows-[auto,1fr] h-full">
          <div className="grid grid-cols-2 gap-4 p-4 text-sm">
            {header ? (
              <>
                <div className="rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3">
                  <div className="font-medium">CPU</div>
                  <div className="text-2xl">{header.cpu}%</div>
                </div>
                <div className="rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3">
                  <div className="font-medium">Memória</div>
                  <div className="text-2xl">
                    {header.memUsage} / {header.memLimit} MB ({header.memPct}%)
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3">
                  <div className="font-medium">Rede</div>
                  <div>
                    RX {header.rx} MB · TX {header.tx} MB
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3">
                  <div className="font-medium">PIDs</div>
                  <div>{header.pids}</div>
                </div>
              </>
            ) : (
              <div className="col-span-2">Coletando métricas…</div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-auto">
            <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3 pb-8  max-h-[280px]">
              <div className="mb-2 text-sm dark:text-[var(--system-white)]">CPU em tempo real</div>
              <CPUChart points={cpuSeries} />
            </div>

            <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3 pb-8 max-h-[280px]">
              <div className="mb-2 text-sm dark:text-[var(--system-white)]">
                Memória em tempo real
              </div>
              <MemoryChart
                percentPoints={memPctSeries}
                usageMBPoints={memUsageMBSeries}
                limitMB={memLimitMBRef.current ?? undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 place-items-center">
            <div className="rounded-xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] p-3 w-fit h-fit">
              {header
                ? new Date(header.t).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                : 'aguardando primeiras amostras'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerStatsModal;
