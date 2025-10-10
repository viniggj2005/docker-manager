import React from 'react';
import { MdContentCopy } from 'react-icons/md';

const CardFooter: React.FC<{ id: string }> = ({ id }) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="text-[14px] text-[var(--medium-gray)]">{id.slice(0, 12)}</div>
    <div className="opacity-0 transition group-hover:opacity-100">
      <button
        className="rounded-xl flex border border-[var(--light-gray)] bg-[var(--system-white)] px-3 py-1.5 text-sm text-[var(--system-black)] hover:scale-95"
        onClick={() => navigator.clipboard.writeText(id)}
      >
        <MdContentCopy /> Copiar ID
      </button>
    </div>
  </div>
);

export default CardFooter;
