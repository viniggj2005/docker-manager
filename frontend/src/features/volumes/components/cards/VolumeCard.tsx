import { FiInfo } from 'react-icons/fi';
import { FaHardDrive } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import React, { useCallback, useState } from 'react';
import { VolumeService } from '../../services/VolumeService';
import { VolumeItem } from '../../../../interfaces/VolumeInterfaces';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { FormatBytes } from '../../../shared/functions/TreatmentFunction';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';

interface VolumeCardProps extends VolumeItem {
  clientId: number;
  onDeleted?: (name: string) => void;
}

const VolumeCard: React.FC<VolumeCardProps> = ({
  Name,
  Scope,
  Driver,
  clientId,
  UsageData,
  onDeleted,
  CreatedAt,
  Mountpoint,
}) => {
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isInspectLoading, setIsInspectLoading] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);
  const confirmToast = useConfirmToast();

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
    confirmToast({
      id: `delete-volume-${Name}`,
      title: 'Remover Volume',
      message: `Tem certeza que deseja remover o volume "${Name}"?\nEsta ação não pode ser desfeita.`,
      onConfirm: async () => {
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
      },
    });
  }, [clientId, Name, onDeleted, confirmToast]);

  const createdDate = CreatedAt ? new Date(CreatedAt) : null;
  const createdLabel = createdDate ? createdDate.toLocaleString() : '—';

  return (
    <>
      <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaHardDrive className="w-5 h-5 text-orange-600" />
            </div>
            <div className="truncate text-xl font-medium text-[var(--system-black)] flex-1 hover:scale-[0.99] dark:text-[var(--system-white)]">
              <h3 className="mb-1 truncate">{Name}</h3>
            </div>
          </div>

          <div className="flex gap-1">
            <button onClick={handleOpenInspect}
              disabled={isInspectLoading} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <FiInfo className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={handleDelete}
              disabled={deleteLoading}
              className="p-1.5 hover:bg-red-50 rounded transition-colors">
              <FaRegTrashAlt className="w-4 h-4 text-red-600" />
            </button>
            {/* <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button> */}
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Driver</p>
              <p className="text-sm">{Driver ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Scope</p>
              <p className="text-sm">{Scope ?? '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tamanho</p>
              <p className="text-sm">{UsageData?.Size ? FormatBytes(UsageData.Size) : '—'}
                {UsageData?.RefCount !== undefined ? ` • ${UsageData.RefCount} refs` : ''}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Criado</p>
              <p className="text-sm">{createdLabel}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mountpoint</p>
            <p className="text-xs text-gray-700 font-mono break-all">{Mountpoint ?? '—'}</p>
          </div>
        </div>
      </div>
      {isInspectOpen && (
        <InspectModal title="Inspect Volume" name={Name} data={inspectData || ''} onClose={handleCloseInspect} />
      )
      }
    </>
  );
};

export default VolumeCard;
