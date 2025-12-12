import { IoMdCloseCircleOutline } from 'react-icons/io';
import React, { useEffect, useRef, useMemo } from 'react';
import { toBase64 } from '../../functions/TreatmentFunctions';
import EditSshConnectionForm from '../forms/EditSshConnectionForm';
import {
  CreateSshConnectionInterface,
  EditSshConnectionModalProps,
} from '../../../../interfaces/TerminalInterfaces';

const EditSshConnectionModal: React.FC<EditSshConnectionModalProps> = ({
  open,
  onClose,
  onCreated,
  connection,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const normalized: CreateSshConnectionInterface | null = useMemo(() => {
    if (!connection) return null;
    return {
      userId: undefined,
      host: connection.host,
      key: toBase64(connection.key),
      systemUser: connection.systemUser,
      port: connection.port ?? undefined,
      alias: connection.alias ?? undefined,
      knownHosts: connection.knownHostsData ?? undefined,
    };
  }, [connection]);

  if (!open || !normalized) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-labelledby="edit-ssh-modal-title"
    >
      <div
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl bg-white
          rounded-2xl border border-gray-300 dark:border-white/10
          dark:bg-zinc-900 shadow-2xl dark:text-white"
      >
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-gray-300 dark:border-white/10 px-5 py-3 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            <h2 id="edit-ssh-modal-title" className="text-sm font-medium">
              Editar conexão SSH
            </h2>
            <span className="text-xs text-zinc-400">modifique os dados necessários</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center
                       rounded-full text-red-600
                       hover:bg-red-600 hover:text-white hover:scale-95 transition"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <IoMdCloseCircleOutline className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-auto p-5">
          <EditSshConnectionForm
            connection={normalized}
            id={connection!.id}
            onSuccess={() => {
              onClose();
              onCreated?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSshConnectionModal;
