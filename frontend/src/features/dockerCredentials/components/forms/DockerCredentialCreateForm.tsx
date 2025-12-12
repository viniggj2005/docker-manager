import iziToast from "izitoast";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useAuth } from "../../../../contexts/AuthContext";
import TextField from "../../../login/components/fields/TextField";
import { useDockerClient } from "../../../../contexts/DockerClientContext";
import { DockerCredentialService } from "../../services/DockerCredentialService";

const fileTypes = ['PEM', 'TXT'];

const DockerCredentialCreateForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
    const [ca, setCa] = useState('');
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');
    const { refresh } = useDockerClient();
    const [cert, setCert] = useState('');
    const [alias, setAlias] = useState('');
    const [caFileName, setCaFileName] = useState('');
    const [description, setDescription] = useState('');
    const [keyFileName, setKeyFileName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [certFileName, setCertFileName] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const { user, token, loading: authLoading, isAuthenticated } = useAuth();

    const disableForm = !token || !user || submitting;
    const handleFileUpload = async (
        file: File | File[],
        setContent: React.Dispatch<React.SetStateAction<string>>,
        setName: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (disableForm) return;
        const selectedFile = Array.isArray(file) ? file[0] : file;
        if (!selectedFile) return;

        try {
            const text = await selectedFile.text();
            setContent(text);
            setName(selectedFile.name);
        } catch (error) {
            iziToast.error({
                title: 'Erro',
                message: 'Não foi possível ler o arquivo selecionado.',
                position: 'bottomRight',
            });
        }
    };

    const handleCaUpload = (file: File | File[]) => handleFileUpload(file, setCa, setCaFileName);
    const handleKeyUpload = (file: File | File[]) => handleFileUpload(file, setKey, setKeyFileName);
    const handleCertUpload = (file: File | File[]) => handleFileUpload(file, setCert, setCertFileName);

    if (authLoading) {
        return (
            <div className="flex flex-1 flex-col">
                <div className="mx-auto max-w-3xl text-sm text-zinc-400">Carregando…</div>
            </div>
        );
    }

    if (!isAuthenticated || !token || !user) {
        return (
            <div className="flex flex-1 flex-col">
                <div className="mx-auto max-w-2xl rounded-2xl border border-gray-300 bg-white p-6 text-sm text-gray-500 shadow-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                    Sessão inválida. Faça login para gerenciar suas credenciais Docker.
                </div>
            </div>
        );
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);

        if (!alias.trim() || !url.trim() || !ca.trim() || !cert.trim() || !key.trim()) {
            setFormError('Preencha todos os campos antes de salvar.');
            return;
        }

        try {
            setSubmitting(true);
            await DockerCredentialService.create(token, {
                ca,
                key,
                cert,
                url: url.trim(),
                userId: user.id,
                alias: alias.trim(),
                description: description.trim(),
            });
            setCa('');
            setUrl('');
            setKey('');
            setCert('');
            setAlias('');
            setCaFileName('');
            setDescription('');
            setKeyFileName('');
            setCertFileName('');
            iziToast.success({
                title: 'Sucesso!',
                message: 'Credencial criada com sucesso.',
                position: 'bottomRight',
            });
            await refresh();
            onSuccess?.();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setFormError(message);
            iziToast.error({ title: 'Erro', message, position: 'bottomRight' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-800">
            <header className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Nova credencial
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        Informe o host e as chaves TLS geradas para o daemon Docker remoto.
                    </p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid gap-4">
                <TextField
                    label="Alias"
                    name="alias"
                    value={alias}
                    onChange={(event) => setAlias(event.target.value)}
                    placeholder="Produção – São Paulo"
                    required
                    disabled={disableForm}
                />
                <TextField
                    label="Descrição"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Servidor de produção."
                    required
                    disabled={disableForm}
                />

                <TextField
                    label="Endpoint"
                    name="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="tcp://meu-docker:2376"
                    required
                    disabled={disableForm}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2 sm:col-span-1">
                        <div>
                            <label
                                className="mb-1 block text-sm font-medium text-black dark:text-white"
                                htmlFor="ca"
                            >
                                CA (PEM)
                            </label>
                            <div
                                className={`rounded-xl border border-dashed border-gray-300 p-4 text-sm transition dark:border-white/10 ${disableForm
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'cursor-pointer hover:border-blue-600'
                                    }`}
                            >
                                <FileUploader
                                    handleChange={handleCaUpload}
                                    name="ca"
                                    types={fileTypes}
                                    disabled={disableForm}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span>
                                            {caFileName
                                                ? `Selecionado: ${caFileName}`
                                                : 'Arraste e solte ou clique para enviar'}
                                        </span>
                                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                                    </div>
                                </FileUploader>
                            </div>
                        </div>
                        <textarea
                            id="ca"
                            value={ca}
                            onChange={(event) => setCa(event.target.value)}
                            placeholder="-----BEGIN CERTIFICATE-----\n..."
                            className="h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-black transition focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                            disabled={disableForm}
                            required
                        />
                    </div>

                    <div className="grid gap-2 sm:col-span-1">
                        <div>
                            <label
                                className="mb-1 block text-sm font-medium text-black dark:text-white"
                                htmlFor="cert"
                            >
                                Cert (PEM)
                            </label>
                            <div
                                className={`rounded-xl border border-dashed border-gray-300 p-4 text-sm transition dark:border-white/10 ${disableForm
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'cursor-pointer hover:border-blue-600'
                                    }`}
                            >
                                <FileUploader
                                    handleChange={handleCertUpload}
                                    name="cert"
                                    types={fileTypes}
                                    disabled={disableForm}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span>
                                            {certFileName
                                                ? `Selecionado: ${certFileName}`
                                                : 'Arraste e solte ou clique para enviar'}
                                        </span>
                                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                                    </div>
                                </FileUploader>
                            </div>
                        </div>
                        <textarea
                            id="cert"
                            value={cert}
                            onChange={(event) => setCert(event.target.value)}
                            placeholder="-----BEGIN CERTIFICATE-----\n..."
                            className="h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-black transition focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                            disabled={disableForm}
                            required
                        />
                    </div>

                    <div className="grid gap-2 sm:col-span-1">
                        <div>
                            <label
                                className="mb-1 block text-sm font-medium text-black dark:text-white"
                                htmlFor="key"
                            >
                                Key (PEM)
                            </label>
                            <div
                                className={`rounded-xl border border-dashed border-gray-300 p-4 text-sm transition dark:border-white/10 ${disableForm
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'cursor-pointer hover:border-blue-600'
                                    }`}
                            >
                                <FileUploader
                                    handleChange={handleKeyUpload}
                                    name="key"
                                    types={fileTypes}
                                    disabled={disableForm}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span>
                                            {keyFileName
                                                ? `Selecionado: ${keyFileName}`
                                                : 'Arraste e solte ou clique para enviar'}
                                        </span>
                                        <span className="rounded-md border px-2 py-1 text-xs">Procurar</span>
                                    </div>
                                </FileUploader>
                            </div>
                        </div>
                        <textarea
                            id="key"
                            value={key}
                            onChange={(event) => setKey(event.target.value)}
                            placeholder="-----BEGIN PRIVATE KEY-----\n..."
                            className="h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-black transition focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                            disabled={disableForm}
                            required
                        />
                    </div>
                </div>

                {formError ? (
                    <div className="text-sm text-red-600">{formError}</div>
                ) : null}

                <button
                    type="submit"
                    disabled={disableForm}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-base font-semibold text-white transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? 'Salvando…' : 'Salvar credencial'}
                </button>
            </form>
        </div>

    );
};

export default DockerCredentialCreateForm;
