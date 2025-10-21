import iziToast from 'izitoast';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useAuth } from '../../../../contexts/AuthContext';
import { TerminalServices } from '../../services/TerminalServices';
import { CreateSshConnectionInterface } from '../../../../interfaces/TerminalInterfaces';

const labelBase = 'text-xs font-medium text-[var(--grey-text)]';

const inputBase =
  'w-full rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] ' +
  'bg-[var(--system-white)] dark:bg-[var(--dark-secondary)] px-3 py-2 outline-none ' +
  'focus:ring-2 focus:ring-emerald-500 dark:text-[var(--system-white)]';

const CreateSshConnectionForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const fileTypes = ['PEM', 'TXT'];
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [formData, setFormData] = useState<CreateSshConnectionInterface>({
    key: '',
    port: 22,
    host: '',
    systemUser: '',
    knownHosts: '',
    userId: user ? user.id : 1,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'port') {
      setFormData((previous) => ({ ...previous, [name]: Number(value) || 0 }));
    } else {
      setFormData((previous) => ({ ...previous, [name]: value }));
    }
  };

  const handleFileChange = async (file: File | File[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    setFileName(selectedFile.name);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(selectedFile);
    });

    setFormData((previous) => ({ ...previous, key: base64 }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await TerminalServices.createSshConnection(formData);
      onSuccess?.();
    } catch (error) {
      iziToast.error({
        title: 'Erro',
        message: `Erro ao criar conexão: ${String(error)}`,
        position: 'bottomRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-1.5">
          <label className={labelBase}>Host</label>
          <input
            className={inputBase}
            type="text"
            name="host"
            value={formData.host}
            onChange={handleChange}
            required
            placeholder="ex: 192.168.0.10 ou domínio"
          />
        </div>

        <div className="grid gap-1.5">
          <label className={labelBase}>Usuário do sistema</label>
          <input
            className={inputBase}
            type="text"
            name="systemUser"
            value={formData.systemUser}
            onChange={handleChange}
            required
            placeholder="ex: ubuntu, ec2-user, root"
          />
        </div>

        <div className="grid gap-1.5">
          <label className={labelBase}>Porta</label>
          <input
            className={inputBase}
            type="number"
            min={1}
            max={65535}
            name="port"
            value={formData.port}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 grid gap-1.5">
          <label className={labelBase}>
            Known Hosts <span className="opacity-60">(opcional)</span>
          </label>
          <input
            className={inputBase}
            type="text"
            name="knownHosts"
            value={formData.knownHosts}
            onChange={handleChange}
            placeholder="conteúdo do known_hosts ou hash"
          />
        </div>

        <div className="md:col-span-2 grid gap-2">
          <label className={labelBase}>Arquivo da chave (.pem, .txt)</label>
          <div className="rounded-lg border border-dashed border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] p-4">
            <FileUploader handleChange={handleFileChange} name="key" types={fileTypes}>
              <div className="flex cursor-pointer items-center justify-between">
                <span className="text-sm">
                  {fileName ? `Selecionado: ${fileName}` : 'Arraste e solte ou clique para enviar'}
                </span>
                <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
              </div>
            </FileUploader>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSuccess}
          className="rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-4 py-2 text-sm hover:scale-[0.98]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-[var(--system-white)] hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Criando…' : 'Criar conexão'}
        </button>
      </div>
    </form>
  );
};

export default CreateSshConnectionForm;
