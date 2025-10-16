import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import React, { useEffect, useRef, useState } from 'react';
import { EventsOn } from '../../../../wailsjs/runtime/runtime';
import type { terminal as termNS } from '../../../../wailsjs/go/models';
import { IoMdCloseCircleOutline, IoIosExpand, IoIosContract } from 'react-icons/io';
import { ConnectWith, Send, Resize, Disconnect } from '../../../../wailsjs/go/terminal/Terminal';

type SSHConn = termNS.SSHConn;
type Props = { open: boolean; onClose: () => void; cfg: SSHConn; title?: string };

const HEADER_H = 52;

export default function TerminalModal({ open, onClose, cfg, title = 'Terminal SSH' }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const [maximized, setMaximized] = useState(false);
  const [docked, setDocked] = useState(false);
  const [dockHeight, setDockHeight] = useState(420);

  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHRef = useRef(420);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setDockHeight(Math.round(window.innerHeight * 0.45));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const term = new Terminal({
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: 13,
      lineHeight: 1,
      cursorBlink: true,
      convertEol: true,
      scrollback: 5000,
      allowProposedApi: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(hostRef.current!);
    fit.fit();
    term.focus();

    termRef.current = term;
    fitRef.current = fit;

    const sub = term.onData((d) => Send(d));
    const offData = EventsOn('ssh:data', (chunk: string) => term.write(chunk));
    const offExit = EventsOn('ssh:exit', (msg: string) =>
      term.write(`\r\n[conexão encerrada] ${msg || ''}\r\n`)
    );

    ConnectWith({ ...(cfg as any), Cols: term.cols, Rows: term.rows }).catch((e: any) =>
      term.write(`\r\n[erro] ${String(e)}\r\n`)
    );

    const ro = new ResizeObserver(() => {
      fit.fit();
      Resize(term.cols, term.rows);
    });
    ro.observe(hostRef.current!);
    roRef.current = ro;

    const onWinResize = () => {
      fit.fit();
      Resize(term.cols, term.rows);
    };
    window.addEventListener('resize', onWinResize);

    return () => {
      sub.dispose();
      offData && offData();
      offExit && offExit();
      ro.disconnect();
      roRef.current = null;
      window.removeEventListener('resize', onWinResize);
      Disconnect();
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, [open, cfg]);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      if (fitRef.current && termRef.current) {
        fitRef.current.fit();
        Resize(termRef.current.cols, termRef.current.rows);
      }
    });
  }, [maximized, docked, dockHeight, open]);

  if (!open) return null;

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!docked && e.target === e.currentTarget) onClose();
  };

  const onDockGripDown = (e: React.MouseEvent<HTMLDivElement>) => {
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHRef.current = dockHeight;

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = startYRef.current - ev.clientY;
      const next = Math.max(240, Math.min(window.innerHeight - 80, startHRef.current + delta));
      setDockHeight(next);
    };
    const onUp = () => {
      resizingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const containerBase =
    'relative shadow-2xl text-[var(--system-black)] dark:text-[var(--system-white)] ' +
    'bg-[var(--system-white)] dark:bg-[var(--dark-primary)] ';
  const modalSize =
    'w-[min(90vw,1100px)] h-[min(85vh,780px)] rounded-2xl border ' +
    'border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]';
  const fullscreenSize = 'w-screen h-screen rounded-none border-0';
  const dockedSize =
    'w-screen rounded-t-2xl border-t ' +
    'border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]';

  const containerClasses =
    containerBase + (maximized ? fullscreenSize : docked ? dockedSize : modalSize);

  const containerStyle: React.CSSProperties = {
    height: maximized ? '100vh' : docked ? dockHeight : undefined,
  };

  return (
    <div
      onClick={closeOnBackdrop}
      className={
        'fixed inset-0 z-50 flex ' +
        (docked
          ? 'items-end justify-center pointer-events-none'
          : 'items-center justify-center bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)] backdrop-blur-sm')
      }
      aria-modal
      role="dialog"
    >
      <div
        className={containerClasses + ' pointer-events-auto'}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {docked && !maximized && (
          <div
            onMouseDown={onDockGripDown}
            className="h-2 cursor-row-resize bg-transparent hover:bg-white/5 dark:hover:bg-white/10 rounded-t-2xl"
            title="Arraste para redimensionar"
          />
        )}

        <Header
          title={title}
          maximized={maximized}
          docked={docked}
          onToggleMax={() => setMaximized((v) => !v)}
          onToggleDock={() => setDocked((v) => !v)}
          onClose={onClose}
        />

        <div className="flex h-[calc(100%-52px)] flex-col">
          <div ref={hostRef} className="flex-1 min-h-0 w-full" />
        </div>
      </div>
    </div>
  );
}

function Header({
  title,
  maximized,
  docked,
  onToggleMax,
  onToggleDock,
  onClose,
}: {
  title: string;
  maximized: boolean;
  docked: boolean;
  onToggleMax: () => void;
  onToggleDock: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-3 border-b
                 border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]
                 px-5 py-3 dark:bg-[var(--dark-primary)]"
      style={{ height: HEADER_H }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-zinc-400">{docked ? 'Painel' : 'Modal'}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleDock}
          className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded border border-transparent hover:border-zinc-600"
          title={docked ? 'Desancorar (modal)' : 'Ancorar embaixo (painel)'}
          type="button"
        >
          {docked ? 'Desancorar' : 'Ancorar'}
        </button>

        <button
          onClick={onToggleMax}
          className="text-zinc-400 hover:text-zinc-200"
          title={maximized ? 'Restaurar' : 'Tela cheia'}
          type="button"
        >
          {maximized ? <IoIosContract className="h-5 w-5" /> : <IoIosExpand className="h-5 w-5" />}
        </button>

        <button
          onClick={onClose}
          className="ml-1 text-rose-400 hover:text-rose-300"
          title="Fechar"
          type="button"
        >
          <IoMdCloseCircleOutline className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
