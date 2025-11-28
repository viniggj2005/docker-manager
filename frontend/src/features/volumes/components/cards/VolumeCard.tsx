import React, { useCallback, useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { RiFileList2Line } from 'react-icons/ri';
import InfoTile from '../../../containers/components/badges/InfoTile';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { VolumeItem } from '../../../../interfaces/VolumeInterfaces';
import { VolumeService } from '../../services/VolumeService';
import { FormatBytes } from '../../../shared/functions/TreatmentFunction';

interface VolumeCardProps extends VolumeItem {
  clientId: number;
  onDeleted?: (name: string) => void;
}

const VolumeCard: React.FC<VolumeCardProps> = ({
  clientId,
  onDeleted,
  Name,
  Driver,
  Mountpoint,
  CreatedAt,
  Scope,
  Labels,
  Options,
  UsageData,
}) => {
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isInspectLoading, setIsInspectLoading] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);

  const handleOpenInspect = useCallback(async () => {
    try {
      setIsInspectLoading(true);
      const data = await VolumeService.inspectVolume(clientId, Name);
      setInspectData(data);
      setIsInspectOpen(true);
    } catch (error) {
      console.error(error);
      setInspectData('Erro ao buscar dados de inspeção.');
      setIsInspectOpen(true);
    } finally {
      setIsInspectLoading(false);
    }
  }, [clientId, Name]);

  const handleCloseInspect = useCallback(() => {
    setIsInspectOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover o volume "${Name}"?\nEsta ação não pode ser desfeita.`
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      await VolumeService.deleteVolume(clientId, Name);
      onDeleted?.(Name);
    } catch (error) {
      console.error(error);
      alert('Erro ao remover volume. Verifique os logs.');
    } finally {
      setDeleteLoading(false);
    }
  }, [clientId, Name, onDeleted]);

  const createdDate = CreatedAt ? new Date(CreatedAt) : null;
  const createdLabel = createdDate ? createdDate.toLocaleString() : '—';

  const labelEntries = Labels ? Object.entries(Labels) : [];
  const optionEntries = Options ? Object.entries(Options) : [];

  return (
    <>
      <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="relative max-w-full pr-7">
              <div className="truncate text-xl font-medium text-[var(--system-black)] transition hover:scale-[0.99] dark:text-[var(--system-white)]">
                {Name}
              </div>

              <div className="mt-1 truncate text-xs text-[var(--medium-gray)]">Driver: {Driver ?? '—'}</div>
            </div>

            <div className="mt-1 text-sm text-[var(--medium-gray)]">
              Escopo:{' '}
              <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
                {Scope ?? '—'}
              </span>
            </div>
            <div className="mt-1 text-sm text-[var(--medium-gray)]">
              Montagem:{' '}
              <span className="block w-32 overflow-hidden whitespace-nowrap text-ellipsis">
                {Mountpoint ?? '—'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={handleOpenInspect}
              disabled={isInspectLoading}
              title="Inspecionar volume"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--system-black)] transition hover:scale-95 disabled:opacity-60 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
            >
              <RiFileList2Line className="h-5 w-5" />
              <span className="sm:hidden">{isInspectLoading ? 'Carregando...' : 'Inspecionar'}</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              title="Remover volume"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--exit-red)] transition hover:scale-95 disabled:opacity-60 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
            >
              <IoMdTrash className="h-5 w-5" />
              <span className="sm:hidden">{deleteLoading ? 'Removendo...' : 'Remover'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-md">
          <InfoTile label="Criado">
            <span className="mt-0.5 font-medium ">{createdLabel}</span>
          </InfoTile>

          <InfoTile label="Tamanho / Referências">
            <span className="mt-0.5 font-medium ">
              {UsageData?.Size ? FormatBytes(UsageData.Size) : '—'}
              {UsageData?.RefCount !== undefined ? ` • ${UsageData.RefCount} refs` : ''}
            </span>
          </InfoTile>

          <InfoTile label="Labels" full>
            {labelEntries.length === 0 ? (
              <span className="mt-0.5 text-[var(--medium-gray)]">Nenhum label</span>
            ) : (
              <ul className="mt-0.5 space-y-1 text-sm">
                {labelEntries.map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between gap-2 rounded-lg bg-[var(--light-overlay)] px-3 py-1 dark:bg-[var(--dark-secondary)]">
                    <span className="text-[var(--medium-gray)]">{key}</span>
                    <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </InfoTile>

          <InfoTile label="Opções" full>
            {optionEntries.length === 0 ? (
              <span className="mt-0.5 text-[var(--medium-gray)]">Nenhuma opção</span>
            ) : (
              <ul className="mt-0.5 space-y-1 text-sm">
                {optionEntries.map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between gap-2 rounded-lg bg-[var(--light-overlay)] px-3 py-1 dark:bg-[var(--dark-secondary)]">
                    <span className="text-[var(--medium-gray)]">{key}</span>
                    <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </InfoTile>
        </div>
      </div>

      {isInspectOpen && (
        <InspectModal title="Inspect Volume" name={Name} data={inspectData || ''} onClose={handleCloseInspect} />
      )}
    </>
  );
};

export default VolumeCard;
