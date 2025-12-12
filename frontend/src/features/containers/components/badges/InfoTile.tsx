import React from 'react';

type Props = { label: string; children: React.ReactNode; full?: boolean };

const InfoTile: React.FC<Props> = ({ label, children, full }) => (
  <div
    className={`${full ? 'col-span-2' : ''} rounded-xl border dark:border-white/10 border-gray-300 bg-slate-50 dark:bg-zinc-800 p-3 `}
  >
    <div className="text-[14px] uppercase text-gray-500">{label}</div>
    <div className="mt-0.5 font-medium text-zinc-900 dark:text-white">
      {children}
    </div>
  </div>
);

export default InfoTile;
