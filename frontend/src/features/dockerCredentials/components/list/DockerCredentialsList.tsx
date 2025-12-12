import { useMemo, useEffect } from "react";
import iziToast from 'izitoast';
import { FiKey } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { useDockerClient } from "../../../../contexts/DockerClientContext";
import { DockerCredentialService } from "../../services/DockerCredentialService";
import { useConfirmToast } from "../../../shared/components/toasts/ConfirmToast";

const DockerCredentialsList: React.FC = () => {
    const { token } = useAuth();
    const confirmToast = useConfirmToast();
    const {
        refresh,
        connecting,
        credentials,
    } = useDockerClient();
    const sortedCredentials = useMemo(
        () => credentials.slice().sort((a, b) => a.alias.localeCompare(b.alias)),
        [credentials]
    );
    const handleDelete = (id: number, name: string) => {
        if (!token) return;
        confirmToast({
            id: `${id}`,
            title: `Conexão ${name} deletada!`,
            message: `Deseja deletar A conexão ${name} docker?`,
            onConfirm: async () => {
                await DockerCredentialService.delete(token, id)
                await refresh()
            },
        });
    };

    useEffect(() => {
        if (sortedCredentials.length === 0) {
            iziToast.info({
                title: 'Vazio',
                message: 'Nenhuma credencial cadastrada até o momento.',
                position: 'bottomRight',
            });
        }
        if (connecting) {
            iziToast.info({
                title: 'Conectando',
                message: 'Estabelecendo conexão segura com o Docker remoto...',
                position: 'bottomRight',
            });
        }
    }, [sortedCredentials.length, connecting]);

    return (
        <div>
            {sortedCredentials.length > 0 && (
                <div className="space-y-4">
                    {sortedCredentials.map((credential) => {
                        return (
                            <div
                                key={credential.id}
                                className="border border-gray-200 rounded-xl p-6 text-black bg-white flex items-center justify-between"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <FiKey className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold">{credential.alias}</h3>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                                            {credential.description ? credential.description : "N/A"}
                                        </p>
                                        {credential.createdAt && (
                                            <p className="text-gray-400 text-xs">
                                                Criado em {new Date(credential.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(credential.id, credential.alias);
                                        }}
                                        title="Excluir Conexão"
                                        className="p-2 hover:bg-gray-100 hover:scale-90 rounded-lg transition-colors"
                                    >
                                        <FaRegTrashAlt className="text-red-600 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
export default DockerCredentialsList;

