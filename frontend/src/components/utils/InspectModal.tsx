import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import React, { useEffect, useRef, useState } from 'react';
import { InspectImage } from '../../../wailsjs/go/docker/Docker';

interface InspectProps {
  name: string;
  title: string;
  data: string | null;
  onClose: () => void;
}

const InspectModal: React.FC<InspectProps> = ({ name, data, title, onClose }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal
      role="dialog"
    >
      <div className="relative w-[min(90vw,900px)] h-[min(80vh,650px)] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl text-zinc-100">
        <div className="sticky top-0 z-10 flex items-center rounded-t-2xl gap-3 border-b border-white/10 px-5 py-3 bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-medium">{title}</h2>
            <span className="text-xs text-zinc-400">{name}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="ml-1 text-rose-400 hover:text-rose-300"
              title="Fechar"
            >
              <IoMdCloseCircleOutline className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[calc(100%-52px)] overflow-y-auto px-5 py-4 font-mono text-xs whitespace-pre-wrap"
        >
          {data || 'Sem dados disponíveis'}
        </div>
      </div>
    </div>
  );
};

export default InspectModal;
