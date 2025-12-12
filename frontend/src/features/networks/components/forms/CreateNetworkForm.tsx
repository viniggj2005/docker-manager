import React, { useState } from 'react';
import { network } from '../../../../../wailsjs/go/models';
import { NetworkService } from '../../services/NetworkService';
import { useDockerClient } from '../../../../contexts/DockerClientContext';

interface Props {
  onSuccess: () => void;
}

const CreateNetworkForm: React.FC<Props> = ({ onSuccess }) => {
  const { selectedCredentialId } = useDockerClient();

  const [name, setName] = useState("");
  const [driver, setDriver] = useState("bridge");
  const [internal, setInternal] = useState(false);
  const [attachable, setAttachable] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCredentialId) return;

    try {
      const options = new network.CreateOptions({
        Driver: driver,
        Scope: "local",
        Internal: internal,
        Attachable: attachable,
        Ingress: false,
        ConfigOnly: false,
        Options: {},
        Labels: {},
      });

      await NetworkService.createNetwork(selectedCredentialId, name, options);

      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border px-3 py-2 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Driver</label>
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          className="w-full rounded-md border px-3 py-2 dark:bg-zinc-800"
        >
          <option value="bridge">bridge</option>
          <option value="overlay">overlay</option>
          <option value="host">host</option>
          <option value="macvlan">macvlan</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
        <span className="text-sm">Internal</span>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={attachable} onChange={(e) => setAttachable(e.target.checked)} />
        <span className="text-sm">Attachable</span>
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 text-sm"
      >
        Criar Network
      </button>
    </form>
  );
};

export default CreateNetworkForm;
