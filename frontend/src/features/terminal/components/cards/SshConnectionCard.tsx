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
        <div key={connection.id} className="flex items-center gap-4 p-4 bg-white text-black rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <LuMonitor className="w-5 h-5 text-gray-600" />
            </div>
            <div>
                <h3 className="mb-1">{connection.alias || `${connection.systemUser}@${connection.host}`}</h3>
                <div className="text-gray-500 text-sm">
                    {connection.systemUser}@{connection.host}:{connection.port}
                </div>
            </div>

            <div className="ml-auto flex items-center">
                <button
                    onClick={() => handleConnect(connection.id)}
                    title="Conectar ao terminal"
                    className=" p-2 hover:bg-gray-100 hover:scale-90 rounded-lg transition-colors"
                >
                    <RiTerminalBoxLine className="h-6 w-6" />
                </button>

                <button
                    onClick={() => handleEdit(connection)}
                    title="Editar conexão"
                    className="p-2 hover:bg-gray-100 hover:scale-90 rounded-lg transition-colors"
                >
                    <FiEdit2 className="text-blue-600 w-5 h-5" />
                </button>

                <button
                    onClick={() => handleRemove(
                        connection.id,
                        connection.alias || `${connection.systemUser}@${connection.host}`
                    )}
                    title="Excluir Conexão"
                    className="p-2 hover:bg-gray-100 hover:scale-90 rounded-lg transition-colors"
                >
                    <FaRegTrashAlt className="text-red-600 h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

export default SshConnectionCard;
