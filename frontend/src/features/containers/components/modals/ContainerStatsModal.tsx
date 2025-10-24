import { CPUChart } from '../charts/CpuChart';
import { MemoryChart } from '../charts/MemoryChart';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { EventsOn } from '../../../../../wailsjs/runtime/runtime';
import { BytesToMB } from '../../../shared/functions/TreatmentFunction';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ContainerStatsProps, StatsPayload } from '../../../../interfaces/ContainerInterfaces';
import {
  StartContainerStats,
  StopContainerStats,
} from '../../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

const maxPoints = 10;

const ContainerStatsModal: React.FC<ContainerStatsProps> = ({ id, name, onClose }) => {
  const memoryLimitMBRef = useRef<number | null>(null);
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [cpuSeries, setCpuSeries] = useState<{ time: number; value: number }[]>([]);
  const [memoryPercentageSeries, setMemPctSeries] = useState<{ time: number; value: number }[]>([]);
  const [memoryUsageMBSeries, setMemUsageMBSeries] = useState<{ time: number; value: number }[]>(
    []
  );

  useEffect(() => {
    const offStats = EventsOn('container:stats', (stats: StatsPayload) => {
      if (stats.containerId !== id) return;
      setStats(stats);

      const time = new Date(stats.time).getTime();
      setCpuSeries((serie) => {
        const next = [...serie, { time, value: Number(stats.cpuPercentage) }];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });
      setMemPctSeries((serie) => {
        const next = [...serie, { time, value: Number(stats.memoryPercentage) }];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });
      setMemUsageMBSeries((serie) => {
        const next = [...serie, { time, value: BytesToMB(stats.memoryUsage) }];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });
      if (!memoryLimitMBRef.current) memoryLimitMBRef.current = BytesToMB(stats.memoryLimit);
    });

    const offErr = EventsOn('container:stats:error', (event: any) => {
      if (event?.containerId === id) console.error('stats error:', event.error);
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
      cpu: stats.cpuPercentage.toFixed(1),
      memoryUsage: mb(stats.memoryUsage),
      memoryLimit: mb(stats.memoryLimit),
      memoryPercentage: stats.memoryPercentage.toFixed(1),
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
                    {header.memoryUsage} / {header.memoryLimit} MB ({header.memoryPercentage}%)
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
                percentPoints={memoryPercentageSeries}
                usageMBPoints={memoryUsageMBSeries}
                limitMB={memoryLimitMBRef.current ?? undefined}
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
