import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { MdOpenInNew } from "react-icons/md";
import React, { useEffect, useRef, useState } from 'react';
import TerminalModalHeader from '../headers/TerminalModalHeader';
import { EventsOn } from '../../../../../wailsjs/runtime/runtime';
import { TerminalProps } from '../../../../interfaces/TerminalInterfaces';
import {
  Send,
  Resize,
  Disconnect,
  ConnectWith,
} from '../../../../../wailsjs/go/handlers/TerminalHandlerStruct';

const TerminalModal: React.FC<TerminalProps> = ({
  open,
  onClose,
  configure,
  title = 'Terminal SSH',
}) => {

  const dragRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const [minimized, setMinimized] = useState(false);
  const [miniPos, setMiniPos] = useState({ x: 40, y: 40 });

  useEffect(() => {
    if (!minimized) return;

    const width = 200;
    const height = 50;
    const padding = 20;

    const handleResize = () => {
      setMiniPos({
        x: window.innerWidth - width - padding,
        y: window.innerHeight - height - padding,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minimized]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragRef.current) return;
      setMiniPos({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const up = () => {
      dragRef.current = false;
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, []);

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

    terminal.attachCustomKeyEventHandler((event) => {
      if (event.ctrlKey && !event.shiftKey && (event.key === 'v' || event.key === 'V')) {
        event.preventDefault();
        if (navigator.clipboard?.readText) {
          navigator.clipboard
            .readText()
            .then((text) => {
              if (!text) return;
              const anyTerm = terminal as any;
              if (typeof anyTerm.paste === 'function') {
                anyTerm.paste(text);
              } else {
                terminal.write(text);
                Send(text);
              }
            })
            .catch(() => {
            });
        }
        return false;
      }

      if (event.ctrlKey && !event.shiftKey && (event.key === 'c' || event.key === 'C')) {
        const selection = terminal.getSelection();
        if (selection) {
          event.preventDefault();
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(selection).catch(() => { });
          }
          return false;
        }
        return true;
      }

      return true;
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
      subscription.dispose();
      offData && offData();
      offExit && offExit();
      resizeObserver.disconnect();

      fitRef.current = null;
      terminalRef.current = null;
      resizeObserverRef.current = null;

      window.removeEventListener('resize', onWindowResize);
    };
  }, [open, configure]);

  useEffect(() => {
    if (!open || minimized) return;

    queueMicrotask(() => {
      if (fitRef.current && terminalRef.current) {
        fitRef.current.fit();
        Resize(terminalRef.current.cols, terminalRef.current.rows);
      }
    });
  }, [maximized, docked, dockHeight, open, minimized]);

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

  const fullscreenSize = 'w-screen h-screen appframe-drag cursor-grab active:cursor-grabbing rounded-none border-0';

  const dockedSize =
    'w-screen rounded-t-2xl  ' +
    'border-[var(--light-gray)] dark:border-[var(--dark-tertiary)]';

  const containerClasses =
    containerBase + (maximized ? fullscreenSize : docked ? dockedSize : modalSize);

  const containerStyle: React.CSSProperties = {
    height: maximized ? '100vh' : docked ? dockHeight : undefined,
  };

  const backdropBase = 'fixed inset-0 z-50';
  const backdropVisible =
    'flex ' +
    (docked
      ? 'items-end justify-center pointer-events-none'
      : 'items-center justify-center bg-[var(--light-overlay)] dark:bg-[var(--dark-overlay)] backdrop-blur-sm');

  const backdropHidden = 'pointer-events-none opacity-0 hidden';

  return (
    <>
      {minimized && (
        <div
          style={{
            position: 'fixed',
            left: miniPos.x,
            top: miniPos.y,
            zIndex: 99999,
          }}
          className="cursor-move bg-[var(--system-white)] text-[var(--system-black)] 
                     dark:bg-[var(--dark-secondary)] dark:text-[var(--system-white)]
                     shadow-xl rounded-md px-3 py-2 flex items-center gap-3 select-none"
          onMouseDown={(e) => {
            dragRef.current = true;
            dragStartRef.current = { x: e.clientX - miniPos.x, y: e.clientY - miniPos.y };
          }}
        >
          <span className="font-semibold">{title}</span>

          <button
            className="px-2 py-1 bg-[var(--accent)] hover:scale-95 text-[var(--system-black)] 
                       dark:text-[var(--system-white)] rounded"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMinimized(false)}
          >
            <MdOpenInNew />
          </button>
        </div>
      )}

      <div
        onClick={closeOnBackdrop}
        className={
          backdropBase + ' ' + (minimized ? backdropHidden : backdropVisible)
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
              className="h-2 cursor-row-resize bg-transparent hover:scale-95 rounded-t-2xl"
              title="Arraste para redimensionar"
            />
          )}

          <TerminalModalHeader
            title={title}
            docked={docked}
            onClose={onClose}
            maximized={maximized}
            onToggleDock={() => setDocked((v) => !v)}
            onToggleMax={() => setMaximized((v) => !v)}
            onMinimize={() => setMinimized(true)}
          />

          <div className="flex h-[calc(100%-52px)] flex-col rounded-b-lg pl-2 pt-1 bg-[var(--terminal-background)]">
            <div ref={hostRef} className="flex-1 min-h-0 w-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default TerminalModal;
