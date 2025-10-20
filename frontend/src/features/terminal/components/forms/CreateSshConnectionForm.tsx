import React, { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useAuth } from '../../../../contexts/AuthContext';
import { decodeJwt } from '../../../shared/functions/DecodeJwt';
import { TerminalServices } from '../../services/TerminalServices';
import { CreateSshConnectionInterface } from '../../../../interfaces/TerminalInterfaces';

const fileTypes = ['PEM', 'TXT'];

interface Props {
  onSuccess?: () => void;
}

const inputBase =
  'w-full rounded-lg border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] ' +
  'bg-[var(--system-white)] dark:bg-[var(--dark-secondary)] px-3 py-2 outline-none ' +
  'focus:ring-2 focus:ring-emerald-500 dark:text-[var(--system-white)]';

const labelBase = 'text-xs font-medium text-[var(--grey-text)]';

const CreateSshConnectionForm: React.FC<Props> = ({ onSuccess }) => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState<CreateSshConnectionInterface>({
    key: '',
    port: 22,
    host: '',
    userId: 0,
    systemUser: '',
    knownHosts: '',
  });
  const [fileName, setFileName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token && !user?.id) return;
    const payload = token ? decodeJwt<any>(token) : null;
    const claim =
      payload?.userId ??
      payload?.user_id ??
      payload?.uid ??
      payload?.id ??
      payload?.sub ??
      user?.id;

    const numericId =
      typeof claim === 'string' ? Number(claim) : typeof claim === 'number' ? claim : NaN;

    if (Number.isFinite(numericId) && numericId > 0) {
      setFormData((prev) => ({ ...prev, userId: numericId as number }));
    }
  }, [token, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'port') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFormData((prev) => ({ ...prev, key: base64 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId) {
      alert('Token inválido. userId não encontrado.');
      return;
    }
    setSubmitting(true);
    try {
      await TerminalServices.createSshConnection(formData);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar conexão.');
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
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Criando…' : 'Criar conexão'}
        </button>
      </div>
    </form>
  );
};

export default CreateSshConnectionForm;
