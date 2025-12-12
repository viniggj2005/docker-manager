import React, { useState } from 'react';
import { useTheme } from '../../../../hooks/use-theme';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import ArrowTip from '../../../shared/components/ArrowTip';
import { EditContainerNameModalProps } from '../../../../interfaces/ContainerInterfaces';

const EditContainerNameModal: React.FC<EditContainerNameModalProps> = ({
  id,
  name,
  handleRename,
  setEditNameModal,
}) => {
  const theme = useTheme();
  const [newName, setNewName] = useState(name);

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20
      dark:border-white/10 dark:bg-zinc-900
      bg-white border border-gray-300 rounded-xl shadow-lg p-3
      w-48 flex flex-col items-center gap-2 animate-fade-in"
    >
      <ArrowTip
        position="bottom"
        size={8}
        color={`${theme.theme === 'dark' ? '#27272a' : '#ffffff'} `}
        offset={14}
      />
      <button
        onClick={() => setEditNameModal(false)}
        className="absolute  cursor-pointer -top-2 -right-2 text-red-600 hover:bg-red-600 hover:text-white hover:scale-95 rounded-full "
        title="Fechar"
      >
        <IoMdCloseCircleOutline className="w-5 h-5" />
      </button>
      <input
        type="text"
        placeholder="Novo nome"
        className="w-full border border-gray-500 dark:border-white/10
         bg-transparent rounded-lg px-2 py-1 text-sm
        focus:outline-none focus:ring focus:ring-blue-200"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
      />

      <button
        onClick={() => handleRename(newName, id)}
        className="bg-blue-600 text-white  text-xs px-3 py-1 rounded-lg hover:bg-blue-700"
      >
        Enviar
      </button>
    </div>
  );
};

export default EditContainerNameModal;
