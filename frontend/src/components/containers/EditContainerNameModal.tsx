import React, { useState } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';

interface EditContainerNameModalProps {
  id: string;
  name: string;
  setEditNameModal: (state: boolean) => void;
  handleRename: (newName: string, id: string) => void;
}
const EditContainerNameModal: React.FC<EditContainerNameModalProps> = ({
  id,
  name,
  handleRename,
  setEditNameModal,
}) => {
  const [newName, setNewName] = useState(name);

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20
                                                  bg-[var(--system-white)] border border-[var(--light-gray)] rounded-xl shadow-lg p-3
                                                  w-48 flex flex-col items-center gap-2 animate-fade-in"
    >
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
        className="w-full border border-[var(--medium-gray)] rounded-lg px-2 py-1 text-sm
                                                    focus:outline-none focus:ring focus:ring-blue-200"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <button
        onClick={() => handleRename(newName, id)}
        className="bg-blue-600 text-[var(--system-white)] text-xs px-3 py-1 rounded-lg hover:bg-blue-700"
      >
        Enviar
      </button>
    </div>
  );
};

export default EditContainerNameModal;
