import React, { useEffect, useMemo } from 'react';
import { Modal } from '../../../shared/components/modals/Modal';
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
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Editar conexão SSH"
      description="modifique os dados necessários"
      icon={<span className="inline-block h-2 w-2 rounded-full bg-blue-500" />}
    >
      <div className="pb-2">
        <EditSshConnectionForm
          connection={normalized}
          id={connection!.id}
          onSuccess={() => {
            onClose();
            onCreated?.();
          }}
        />
      </div>
    </Modal>
  );
};

export default EditSshConnectionModal;
