import iziToast from 'izitoast';
import { FiInfo } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import React, { useCallback, useState } from 'react';
import { NetworkService } from '../../services/NetworkService';
import { FmtAgo } from '../../../shared/functions/TreatmentFunction';
import { NetworkItem } from '../../../../interfaces/NetworkInterfaces';
import InspectModal from '../../../shared/components/modals/InspectModal';
import { useConfirmToast } from '../../../shared/components/toasts/ConfirmToast';

interface NetworkCardProps extends NetworkItem {
  clientId: number;
  onDeleted?: (networkId: string) => void;
}

const NetworkCards: React.FC<NetworkCardProps> = ({
  Id,
  Name,
  IPAM,
  Scope,
  Driver,
  Created,
  Ingress,
  clientId,
  Internal,
  onDeleted,
  Attachable,
  EnableIPv4,
  EnableIPv6,
}) => {
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isInspectLoading, setIsInspectLoading] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);
  const confirmToast = useConfirmToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const handleOpenInspect = useCallback(async () => {
    try {
      setIsInspectLoading(true);
      const data = await NetworkService.InspectNetwork(clientId, Id);
      const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      setInspectData(formattedData);
      setIsInspectOpen(true);
    } catch (error) {
      iziToast.error({ title: 'Erro', message: 'Erro ao buscar dados de inspeção.', position: 'bottomRight' });
    } finally {
      setIsInspectLoading(false);
    }
  }, [clientId, Id]);

  const handleCloseInspect = useCallback(() => {
    setIsInspectOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    confirmToast({
      id: Id,
      title: 'Rede removida com sucesso!',
      message: `Deseja remover a rede "${Name}"?`,
      onConfirm: async () => {
        setDeleteLoading(true);
        try {
          await NetworkService.deleteNetwork(clientId, Id);
          onDeleted?.(Id);
        } catch (error) {
          throw error instanceof Error ? error : new Error('Erro ao remover a rede.');
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  }, [Id, Name, clientId, confirmToast, onDeleted]);

  const mainSubnet = IPAM?.Config?.[0]?.Subnet ?? '—';
  const mainGateway = IPAM?.Config?.[0]?.Gateway ?? '—';
  const createdTimestamp = Created ? new Date(Created).getTime() : undefined;

  return (
    <>
      <div className="gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="mb-1 dark:text-gray-100">{Name}</h3>
            <p className="text-xs text-gray-500 mb-2"></p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleOpenInspect}
              disabled={isInspectLoading}
              title="Inspecionar rede"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <FiInfo className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => copyToClipboard(Id)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copiar ID"
            >
              <MdContentCopy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Remover rede"
            >
              <FaRegTrashAlt className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Driver:</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">{Driver}</span>
            <span className="text-gray-600 dark:text-gray-400 mx-2">• Scope:</span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">{Scope}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Criado</p>
              <p className="text-sm dark:text-gray-200">{createdTimestamp ? FmtAgo(createdTimestamp) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">IPv4 / IPv6</p>
              <p className="text-sm dark:text-gray-200">{EnableIPv4 ? 'IPv4: ativo' : 'IPv4: desativado'}
                {' • '}
                {EnableIPv6 ? 'IPv6: ativo' : 'IPv6: desativado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Interna / Attachável</p>
              <p className="text-sm dark:text-gray-200">
                {Internal ? 'Interna' : 'Externa'}
                {' • '}
                {Attachable ? 'Atachável' : 'Não atachável'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ingress</p>
              <p className="text-sm dark:text-gray-200">{Ingress ? 'Sim' : 'Não'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Subnet Principal</p>
              <p className="text-sm dark:text-gray-200">{mainSubnet}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Gateway Principal</p>
              <p className="text-sm dark:text-gray-200">{mainGateway}</p>
            </div>
          </div>
        </div>


        {/* <button
          onClick={handleOpenInspect}
          disabled={isInspectLoading}
          title="Inspecionar rede"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--system-black)] transition hover:scale-95 disabled:opacity-60 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
        >
          <RiFileList2Line className="h-5 w-5" />
          <span className="sm:hidden">
            {isInspectLoading ? 'Carregando...' : 'Inspecionar'}
          </span>
        </button> */}

      </div >

      {isInspectOpen && (
        <InspectModal
          title="Inspect Network"
          name={Name}
          data={inspectData || ''}
          onClose={handleCloseInspect}
        />
      )
      }
    </>
  );
};

export default NetworkCards;
