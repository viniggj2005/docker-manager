import React from 'react';
import { RxMinus } from 'react-icons/rx';
import { TerminalHeaderProps } from '../../../../interfaces/TerminalInterfaces';
import { IoMdCloseCircleOutline, IoIosExpand, IoIosContract } from 'react-icons/io';

const TerminalModalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  docked,
  onClose,
  maximized,
  onMinimize,
  onToggleMax,
  onToggleDock,
}) => {
  return (
    <div
      className="sticky h-[52px] top-0 z-10 flex items-center gap-3 border-b rounded-t-2xl
                 border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]
                 bg-[var(--system-white)] dark:bg-[var(--dark-primary)]
                 px-5 py-3"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-[var(--grey-text)]">{docked ? 'Painel' : 'Modal'}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">

        {!maximized && (
          <button
            onClick={onMinimize}
            className="text-[var(--grey-text)] hover:scale-95"
            title="Minimizar"
            type="button"
          >
            <RxMinus className="w-5 h-5" />
          </button>
        )}

        {!maximized && (
          <button
            onClick={onToggleDock}
            className="text-[var(--grey-text)] hover:scale-95 text-xs px-2 py-1 rounded border border-transparent"
            title={docked ? 'Desancorar (modal)' : 'Ancorar embaixo (painel)'}
            type="button"
          >
            {docked ? 'Desancorar' : 'Ancorar'}
          </button>
        )}

        <button
          onClick={onToggleMax}
          className="text-[var(--grey-text)] hover:scale-95"
          title={maximized ? 'Restaurar' : 'Tela cheia'}
          type="button"
        >
          {maximized ? <IoIosContract className="h-5 w-5" /> : <IoIosExpand className="h-5 w-5" />}
        </button>

        <button
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center
                     rounded-full text-[var(--exit-red)]
                     hover:bg-[var(--exit-red)] hover:text-[var(--system-white)] hover:scale-95 transition"
          aria-label="Fechar"
        >
          <IoMdCloseCircleOutline className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TerminalModalHeader;
