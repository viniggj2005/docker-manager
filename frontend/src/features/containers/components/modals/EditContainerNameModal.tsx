import React, { useState } from 'react';
import ArrowTip from '../../../shared/ArrowTip';
import { useTheme } from '../../../../hooks/use-theme';
import { IoMdCloseCircleOutline } from 'react-icons/io';
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
      dark:border-[var(--dark-tertiary)] dark:bg-[var(--dark-primary)]
      bg-[var(--system-white)] border border-[var(--light-gray)] rounded-xl shadow-lg p-3
      w-48 flex flex-col items-center gap-2 animate-fade-in"
    >
      <ArrowTip
        position="bottom"
        size={8}
        color={`${theme.theme === 'dark' ? 'var(--dark-secondary)' : 'var(--system-white)'} `}
        offset={14}
      />
      <button
        onClick={() => setEditNameModal(false)}
        className="absolute  cursor-pointer -top-2 -right-2 text-[var(--exit-red)] hover:text-[var(--exit-red)]"
        title="Fechar"
      >
        <IoMdCloseCircleOutline className="w-5 h-5" />
      </button>

      <input
        type="text"
        placeholder="Novo nome"
        className="w-full border border-[var(--medium-gray)] dark:border-[var(--dark-tertiary)]
         dark:text-[var(--system-white)] bg-transparent rounded-lg px-2 py-1 text-sm
        focus:outline-none focus:ring focus:ring-blue-200"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <button
        onClick={() => handleRename(newName, id)}
        className="bg-[var(--docker-blue)] text-[var(--system-white)]  text-xs px-3 py-1 rounded-lg hover:bg-blue-700"
      >
        Enviar
      </button>
    </div>
  );
};

export default EditContainerNameModal;
