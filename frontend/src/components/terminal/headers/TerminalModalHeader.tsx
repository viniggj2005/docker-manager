import { IoMdCloseCircleOutline, IoIosExpand, IoIosContract } from 'react-icons/io';
const HEADER_H = 52;
export default function TerminalModalHeader({
  title,
  docked,
  onClose,
  maximized,
  onToggleMax,
  onToggleDock,
}: {
  title: string;
  docked: boolean;
  maximized: boolean;
  onClose: () => void;
  onToggleMax: () => void;
  onToggleDock: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-3 border-b  rounded-t-2xl
                 border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]
                 bg-[var(--system-white)] dark:bg-[var(--dark-primary)]
                 px-5 py-3 "
      style={{ height: HEADER_H }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-[var(--grey-text)]">{docked ? 'Painel' : 'Modal'}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {!maximized && (
          <button
            onClick={onToggleDock}
            className="text-[var(--grey-text)] hover:scale-95 text-xs px-2 py-1 rounded border border-transparent "
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
          className="ml-1 text-[var(--light-red)] hover:scale-95"
          title="Fechar"
          type="button"
        >
          <IoMdCloseCircleOutline className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
