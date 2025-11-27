import React, { useEffect, useRef } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { InspectProps } from '../../../../interfaces/SharedInterfaces';

const InspectModal: React.FC<InspectProps> = ({ name, data, title, onClose }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const highlightQuotedStrings = (text: string) => {
    const regex = /"([^"\\]|\\.)*":/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      const index = match.index;
      if (lastIndex < index) parts.push(text.slice(lastIndex, index));
      parts.push(
        <span key={key++} className="text-[var(--orange-json)]">
          {match[0]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)]  backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div className="relative w-[min(90vw,900px)] h-[min(80vh,650px)] rounded-2xl border border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] bg-[var(--system-white)] dark:bg-[var(--dark-primary)] shadow-2xl text-[var(--system-black )] dark:text-[var(--system-white)] ">
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-[var(--light-gray)] dark:border-[var(--dark-tertiary)] px-5 py-3 dark:bg-[var(--dark-primary)]">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-medium">{title}</h2>
            <span className="text-xs text-zinc-400">{name}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onClose()}
              className="
                        inline-flex h-6 w-6 items-center justify-center
                        rounded-full
                        text-[var(--exit-red)]
                        hover:bg-[var(--exit-red)] hover:text-[var(--system-white)] hover:scale-95
                        transition
                      "
              aria-label="Fechar"
            >
              <IoMdCloseCircleOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[calc(100%-52px)] overflow-y-auto px-5 py-4 font-mono text-sm whitespace-pre-wrap"
        >
          {data ? <div>{highlightQuotedStrings(String(data))}</div> : 'Sem dados disponíveis'}
        </div>
      </div>
    </div>
  );
};

export default InspectModal;
