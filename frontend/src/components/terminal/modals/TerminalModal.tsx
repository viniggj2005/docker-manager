import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import React, { useEffect, useRef, useState } from 'react';
import { EventsOn } from '../../../../wailsjs/runtime/runtime';
import TerminalModalHeader from '../headers/TerminalModalHeader';
import { TerminalProps } from '../../../interfaces/TerminalInterfaces';
import { ConnectWith, Send, Resize, Disconnect } from '../../../../wailsjs/go/terminal/Terminal';

const TerminalModal: React.FC<TerminalProps> = ({ open, onClose, cfg, title = 'Terminal SSH' }) => {
  const fitRef = useRef<FitAddon | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const [docked, setDocked] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [dockHeight, setDockHeight] = useState(420);

  const startYRef = useRef(0);
  const startHRef = useRef(420);
  const resizingRef = useRef(false);

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
      fontSize: 18,
      lineHeight: 1,
      convertEol: true,
      scrollback: 5000,
      cursorBlink: true,
      allowProposedApi: true,
      fontFamily: 'Courier New',
      cursorInactiveStyle: 'none',
      theme: {
        background: '#5e2750',
        foreground: 'var(--grey-text)',
      },
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
      Disconnect();
      sub.dispose();
      term.dispose();
      ro.disconnect();
      offData && offData();
      offExit && offExit();
      roRef.current = null;
      fitRef.current = null;
      termRef.current = null;
      window.removeEventListener('resize', onWinResize);
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
    'relative shadow-2xl overflow-hidden text-[var(--system-black)] dark:text-[var(--system-white)] ';

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
            className="h-2 cursor-row-resize bg-transparent hover:scale-95  rounded-t-2xl"
            title="Arraste para redimensionar"
          />
        )}

        <TerminalModalHeader
          title={title}
          docked={docked}
          onClose={onClose}
          maximized={maximized}
          onToggleMax={() => setMaximized((v) => !v)}
          onToggleDock={() => setDocked((v) => !v)}
        />

        <div className="flex h-[calc(100%-52px)] flex-col rounded-b-lg pl-2 pt-1 bg-[var(--terminal-background)]">
          <div ref={hostRef} className="flex-1 min-h-0 w-full " />
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
