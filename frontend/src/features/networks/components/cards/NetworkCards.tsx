import { IoMdTrash } from 'react-icons/io';
import { RiFileList2Line } from 'react-icons/ri';
import React, { useCallback, useState } from 'react';
import { NetworkService } from '../../services/NetworkService';
import { FmtAgo } from '../../../shared/functions/TreatmentFunction';
import InfoTile from '../../../containers/components/badges/InfoTile';
import { NetworkItem } from '../../../../interfaces/NetworkInterfaces';
import InspectModal from '../../../shared/components/modals/InspectModal';

interface NetworkCardProps extends NetworkItem {
  clientId: number;
  onDeleted?: (networkId: string) => void;
}

const NetworkCards: React.FC<NetworkCardProps> = ({
  clientId,
  onDeleted,
  Name,
  Id,
  Created,
  Driver,
  Scope,
  Internal,
  Attachable,
  Ingress,
  EnableIPv4,
  EnableIPv6,
  IPAM,
}) => {
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isInspectLoading, setIsInspectLoading] = useState(false);
  const [inspectData, setInspectData] = useState<string | null>(null);

  const handleOpenInspect = useCallback(async () => {
    try {
      setIsInspectLoading(true);
      const data = await NetworkService.InspectNetwork(clientId, Id);
      console.log(data)
      setInspectData(data);
      setIsInspectOpen(true);
    } catch (error) {
      setInspectData('Erro ao buscar dados de inspeção.');
      setIsInspectOpen(true);
    } finally {
      setIsInspectLoading(false);
    }
  }, [clientId, Id]);

  const handleCloseInspect = useCallback(() => {
    setIsInspectOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover a rede "${Name}"?\n(ID: ${Id})`
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      await NetworkService.deleteNetwork(clientId, Id);
      onDeleted?.(Id);
    } catch (error) {
      alert('Erro ao remover rede. Verifique os logs.');
    } finally {
      setDeleteLoading(false);
    }
  }, [clientId, Id, Name, onDeleted]);

  const mainSubnet = IPAM?.Config?.[0]?.Subnet ?? '—';
  const mainGateway = IPAM?.Config?.[0]?.Gateway ?? '—';
  const createdTimestamp = Created ? new Date(Created).getTime() : undefined;

  return (
    <>
      <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-sm transition hover:shadow-md dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="relative max-w-full pr-7">
              <div className="truncate text-xl font-medium text-[var(--system-black)] transition hover:scale-[0.99] dark:text-[var(--system-white)]">
                {Name}
              </div>

              <div className="mt-1 truncate text-xs text-[var(--medium-gray)]">
                ID: {Id}
              </div>
            </div>

            <div className="mt-1 text-sm text-[var(--medium-gray)]">
              Driver:{' '}
              <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
                {Driver}
              </span>{' '}
              • Scope:{' '}
              <span className="font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
                {Scope}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={handleOpenInspect}
              disabled={isInspectLoading}
              title="Inspecionar rede"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--system-black)] transition hover:scale-95 disabled:opacity-60 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)] dark:text-[var(--system-white)]"
            >
              <RiFileList2Line className="h-5 w-5" />
              <span className="sm:hidden">
                {isInspectLoading ? 'Carregando...' : 'Inspecionar'}
              </span>
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              title="Remover rede"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm font-medium text-[var(--exit-red)] transition hover:scale-95 disabled:opacity-60 sm:w-auto dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]"
            >
              <IoMdTrash className="h-5 w-5" />
              <span className="sm:hidden">
                {deleteLoading ? 'Removendo...' : 'Remover'}
              </span>
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-md">
          <InfoTile label="Criado">
            <span className="mt-0.5 font-medium ">
              {createdTimestamp ? FmtAgo(createdTimestamp) : '—'}
            </span>
          </InfoTile>

          <InfoTile label="IPv4 / IPv6">
            <span className="mt-0.5 font-medium ">
              {EnableIPv4 ? 'IPv4: ativo' : 'IPv4: desativado'}
              {' • '}
              {EnableIPv6 ? 'IPv6: ativo' : 'IPv6: desativado'}
            </span>
          </InfoTile>

          <InfoTile label="Interna / Atachável">
            <span className="mt-0.5 font-medium ">
              {Internal ? 'Interna' : 'Externa'}
              {' • '}
              {Attachable ? 'Atachável' : 'Não atachável'}
            </span>
          </InfoTile>

          <InfoTile label="Ingress">
            <span className="mt-0.5 font-medium ">{Ingress ? 'Sim' : 'Não'}</span>
          </InfoTile>

          <InfoTile label="Subnet principal" full>
            <span className="mt-0.5 font-medium ">{mainSubnet}</span>
          </InfoTile>

          <InfoTile label="Gateway principal" full>
            <span className="mt-0.5 font-medium ">{mainGateway}</span>
          </InfoTile>
        </div>
      </div>

      {isInspectOpen && (
        <InspectModal
          title="Inspect Network"
          name={Name}
          data={inspectData || ''}
          onClose={handleCloseInspect}
        />
      )}
    </>
  );
};

export default NetworkCards;
