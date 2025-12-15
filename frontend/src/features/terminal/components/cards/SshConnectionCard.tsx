import { FiEdit2 } from "react-icons/fi";
import { LuMonitor } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiTerminalBoxLine } from "react-icons/ri";
import { SshConnectionCardProps } from "../../../../interfaces/TerminalInterfaces";

const SshConnectionCard: React.FC<SshConnectionCardProps> = ({
    connection,
    handleEdit,
    handleRemove,
    handleConnect, }) => {

    return (
        <div key={connection.id} className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:border-white/5 dark:bg-[#0f172a]/80 dark:backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400">
                    <LuMonitor className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                        {connection.alias || `${connection.systemUser}@${connection.host}`}
                    </h3>
                    <div className="font-mono text-sm text-gray-500 dark:text-gray-400">
                        {connection.systemUser}@{connection.host}:{connection.port}
                    </div>
                </div>
            </div>

            <div className="flex gap-1">
                <button
                    onClick={() => handleConnect(connection.id)}
                    title="Conectar ao terminal"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
                >
                    <RiTerminalBoxLine className="h-4 w-4" />
                </button>

                <button
                    onClick={() => handleEdit(connection)}
                    title="Editar conexão"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                >
                    <FiEdit2 className="h-4 w-4" />
                </button>

                <button
                    onClick={() => handleRemove(
                        connection.id,
                        connection.alias || `${connection.systemUser}@${connection.host}`
                    )}
                    title="Excluir Conexão"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                >
                    <FaRegTrashAlt className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default SshConnectionCard;
