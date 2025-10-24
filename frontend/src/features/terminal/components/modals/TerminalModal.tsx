import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import React, { useEffect, useRef, useState } from 'react';
import TerminalModalHeader from '../headers/TerminalModalHeader';
import { EventsOn } from '../../../../../wailsjs/runtime/runtime';
import { TerminalProps } from '../../../../interfaces/TerminalInterfaces';
import {
  ConnectWith,
  Send,
  Resize,
  Disconnect,
} from '../../../../../wailsjs/go/handlers/TerminalHandlerStruct';

const TerminalModal: React.FC<TerminalProps> = ({
  open,
  onClose,
  configure,
  title = 'Terminal SSH',
}) => {
  const startYRef = useRef(0);
  const startHRef = useRef(420);
  const resizingRef = useRef(false);

  const [docked, setDocked] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [dockHeight, setDockHeight] = useState(420);

  const fitRef = useRef<FitAddon | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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
    const terminal = new Terminal({
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
    terminal.loadAddon(fit);
    terminal.open(hostRef.current!);
    fit.fit();
    terminal.focus();

    fitRef.current = fit;
    terminalRef.current = terminal;

    const subscription = terminal.onData((d) => Send(d));
    const offData = EventsOn('ssh:data', (chunk: string) => terminal.write(chunk));
    const offExit = EventsOn('ssh:exit', (msg: string) =>
      terminal.write(`\r\n[conexão encerrada] ${msg || ''}\r\n`)
    );

    ConnectWith({ ...(configure as any), Cols: terminal.cols, Rows: terminal.rows }).catch(
      (e: any) => terminal.write(`\r\n[erro] ${String(e)}\r\n`)
    );

    const resizeObserver = new ResizeObserver(() => {
      fit.fit();
      Resize(terminal.cols, terminal.rows);
    });
    resizeObserver.observe(hostRef.current!);
    resizeObserverRef.current = resizeObserver;

    const onWindowResize = () => {
      fit.fit();
      Resize(terminal.cols, terminal.rows);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      Disconnect();
      terminal.dispose();
      offData && offData();
      offExit && offExit();
      fitRef.current = null;
      subscription.dispose();
      terminalRef.current = null;
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
      window.removeEventListener('resize', onWindowResize);
    };
  }, [open, configure]);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      if (fitRef.current && terminalRef.current) {
        fitRef.current.fit();
        Resize(terminalRef.current.cols, terminalRef.current.rows);
      }
    });
  }, [maximized, docked, dockHeight, open]);

  if (!open) return null;

  const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!docked && event.target === event.currentTarget) onClose();
  };

  const onDockGripDown = (event: React.MouseEvent<HTMLDivElement>) => {
    resizingRef.current = true;
    startYRef.current = event.clientY;
    startHRef.current = dockHeight;

    const onMove = (event: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = startYRef.current - event.clientY;
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
        style={containerStyle}
        onClick={(event) => event.stopPropagation()}
        className={containerClasses + ' pointer-events-auto'}
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
          onToggleDock={() => setDocked((value) => !value)}
          onToggleMax={() => setMaximized((value) => !value)}
        />

        <div className="flex h-[calc(100%-52px)] flex-col rounded-b-lg pl-2 pt-1 bg-[var(--terminal-background)]">
          <div ref={hostRef} className="flex-1 min-h-0 w-full " />
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
