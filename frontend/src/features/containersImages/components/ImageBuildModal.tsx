import iziToast from 'izitoast';
import { IoMdClose } from 'react-icons/io';
import React, { useEffect, useState, useRef } from 'react';
import TextField from '../../login/components/fields/TextField';
import { EventsOn, EventsOff } from '../../../../wailsjs/runtime';
import { ImageCreate } from '../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

interface ImageBuildModalProps {
    clientId: number;
    onClose: () => void;
    onSuccess?: () => void;
}

const ImageBuildModal: React.FC<ImageBuildModalProps> = ({ clientId, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [tag, setTag] = useState('latest');
    const [logs, setLogs] = useState<string[]>([]);
    const [building, setBuilding] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);


    const handleBuild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !tag.trim() || !path.trim()) {
            iziToast.error({ title: 'Erro', message: 'Preencha todos os campos.', position: 'bottomRight' });
            return;
        }


        const nameRegex = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
        if (!nameRegex.test(name)) {
            iziToast.error({
                title: 'Nome Inválido',
                message: 'O nome da imagem deve conter apenas letras minúsculas, números, hífens, pontos ou sublinhados, e não pode conter espaços.',
                position: 'bottomRight'
            });
            return;
        }

        setBuilding(true);
        setLogs([]);

        EventsOn('image:build', (data: any) => {
            if (data && data.log) {
                console.log(data.log);
                setLogs((prev) => [...prev, data.log]);
            }
        });

        try {
            await ImageCreate(clientId, {
                path,
                name,
                tag,
            });
            iziToast.success({ title: 'Sucesso', message: 'Imagem construída com sucesso!', position: 'bottomRight' });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error(err);
            setLogs((prev) => [...prev, `\nError: ${err.message || err}`]);
            iziToast.error({ title: 'Erro', message: err.message || 'Falha ao construir imagem.', position: 'bottomRight' });
        } finally {
            EventsOff('image:build');
            setBuilding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] shadow-2xl dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-secondary)] flex flex-col max-h-[90vh]">

                <div className="flex items-center justify-between border-b border-[var(--light-gray)] p-4 dark:border-[var(--dark-tertiary)]">
                    <h2 className="text-lg font-semibold text-[var(--system-black)] dark:text-[var(--system-white)]">
                        Construir Nova Imagem
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={building}
                        className="rounded-full p-2 text-[var(--medium-gray)] hover:bg-[var(--light-gray)] dark:hover:bg-[var(--dark-tertiary)] disabled:opacity-50"
                    >
                        <IoMdClose className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleBuild} className="grid gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Nome da Imagem"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ex: minha_app"
                                required
                                disabled={building}
                            />
                            <TextField
                                label="Tag"
                                name="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="ex: latest"
                                required
                                disabled={building}
                            />
                        </div>
                        <TextField
                            label="Caminho do Dockerfile (Contexto)"
                            name="path"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            placeholder="Caminho relativo ou absoluto"
                            required
                            disabled={building}
                        />

                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-[var(--system-black)] dark:text-[var(--system-white)]">
                                Logs de Construção
                            </label>
                            <div className="h-64 w-full overflow-y-auto rounded-xl bg-gray-900 p-4 font-mono text-xs text-green-400 shadow-inner">
                                {logs.length === 0 ? (
                                    <span className="text-gray-500 italic">Aguardando início...</span>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} className="whitespace-pre-wrap">{log}</div>
                                    ))
                                )}
                                <div ref={logsEndRef} />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={building}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--medium-gray)] hover:bg-[var(--light-gray)] dark:text-[var(--grey-text)] dark:hover:bg-[var(--dark-tertiary)] disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={building}
                                className="rounded-xl bg-[var(--docker-blue)] px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {building ? 'Construindo...' : 'Construir'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageBuildModal;
