import React from 'react';

type Props = { label: string; children: React.ReactNode; full?: boolean };

const InfoTile: React.FC<Props> = ({ label, children, full }) => (
  <div
    className={`${full ? 'col-span-2' : ''} rounded-xl border dark:border-[var(--dark-tertiary)] border-[var(--light-gray)] bg-slate-50 dark:bg-[var(--dark-secondary)] p-3 `}
  >
    <div className="text-[14px] uppercase text-[var(--medium-gray)]">{label}</div>
    <div className="mt-0.5 font-medium text-[var(--dark-gray)] dark:text-[var(--system-white)]">
      {children}
    </div>
  </div>
);

export default InfoTile;
