import React, { useMemo, useState } from 'react';
import { useDockerClient } from '../../../../contexts/DockerClientContext';
import { VolumeService } from '../../services/VolumeService';

interface CreateVolumeFormProps {
  onSuccess: () => void;
}

interface KeyValueInput {
  key: string;
  value: string;
}

const CreateVolumeForm: React.FC<CreateVolumeFormProps> = ({ onSuccess }) => {
  const { selectedCredentialId } = useDockerClient();

  const [name, setName] = useState('');
  const [driver, setDriver] = useState('local');
  const [driverOpts, setDriverOpts] = useState<KeyValueInput[]>([{ key: '', value: '' }]);
  const [labels, setLabels] = useState<KeyValueInput[]>([{ key: '', value: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedDriverOpts = useMemo(() => {
    return driverOpts
      .filter((entry) => entry.key.trim())
      .reduce<Record<string, string>>((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});
  }, [driverOpts]);

  const parsedLabels = useMemo(() => {
    return labels
      .filter((entry) => entry.key.trim())
      .reduce<Record<string, string>>((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});
  }, [labels]);

  const handleChangeEntry = (
    index: number,
    type: 'driver' | 'label',
    field: 'key' | 'value',
    newValue: string
  ) => {
    if (type === 'driver') {
      setDriverOpts((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: newValue };
        return next;
      });
    } else {
      setLabels((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: newValue };
        return next;
      });
    }
  };

  const handleAddEntry = (type: 'driver' | 'label') => {
    if (type === 'driver') {
      setDriverOpts((prev) => [...prev, { key: '', value: '' }]);
    } else {
      setLabels((prev) => [...prev, { key: '', value: '' }]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCredentialId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await VolumeService.createVolume(selectedCredentialId, {
        Name: name,
        Driver: driver,
        DriverOpts: parsedDriverOpts,
        Labels: parsedLabels,
      });

      onSuccess();
      setName('');
      setDriver('local');
      setDriverOpts([{ key: '', value: '' }]);
      setLabels([{ key: '', value: '' }]);
    } catch (err) {
      console.error(err);
      setError('Não foi possível criar o volume. Consulte os logs para mais detalhes.');
    } finally {
      setIsSubmitting(false);
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
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
          placeholder="meu-volume"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Driver</label>
        <select
          value={driver}
          onChange={(event) => setDriver(event.target.value)}
          className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
        >
          <option value="local">local</option>
          <option value="nfs">nfs</option>
          <option value="tmpfs">tmpfs</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Opções do driver</label>
          <button
            type="button"
            onClick={() => handleAddEntry('driver')}
            className="text-xs font-semibold text-[var(--docker-blue)] hover:underline"
          >
            + Adicionar opção
          </button>
        </div>
        {driverOpts.map((entry, index) => (
          <div key={`driver-${index}`} className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={entry.key}
              onChange={(event) => handleChangeEntry(index, 'driver', 'key', event.target.value)}
              placeholder="chave"
              className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
            />
            <input
              type="text"
              value={entry.value}
              onChange={(event) => handleChangeEntry(index, 'driver', 'value', event.target.value)}
              placeholder="valor"
              className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Labels</label>
          <button
            type="button"
            onClick={() => handleAddEntry('label')}
            className="text-xs font-semibold text-[var(--docker-blue)] hover:underline"
          >
            + Adicionar label
          </button>
        </div>
        {labels.map((entry, index) => (
          <div key={`label-${index}`} className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={entry.key}
              onChange={(event) => handleChangeEntry(index, 'label', 'key', event.target.value)}
              placeholder="chave"
              className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
            />
            <input
              type="text"
              value={entry.value}
              onChange={(event) => handleChangeEntry(index, 'label', 'value', event.target.value)}
              placeholder="valor"
              className="w-full rounded-md border px-3 py-2 dark:bg-[var(--dark-secondary)]"
            />
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-[var(--exit-red)]">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600 text-sm disabled:opacity-60"
      >
        {isSubmitting ? 'Criando...' : 'Criar volume'}
      </button>
    </form>
  );
};

export default CreateVolumeForm;
