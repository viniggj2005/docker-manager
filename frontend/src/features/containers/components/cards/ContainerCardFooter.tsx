import React from 'react';
import { MdContentCopy } from 'react-icons/md';

const CardFooter: React.FC<{ id: string }> = ({ id }) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="text-[14px] dark:text-white text-gray-500">
      {id.slice(0, 12)}
    </div>
    <div className="opacity-0 transition group-hover:opacity-100">
      <button
        className="rounded-xl flex border border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:scale-95"
        onClick={() => navigator.clipboard.writeText(id)}
      >
        <MdContentCopy /> Copiar ID
      </button>
    </div>
  </div>
);

export default CardFooter;
