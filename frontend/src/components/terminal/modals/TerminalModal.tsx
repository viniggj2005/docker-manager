import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { useEffect, useRef } from 'react';
import { FitAddon } from 'xterm-addon-fit';
import { EventsOn } from '../../../../wailsjs/runtime/runtime';
import type { terminal as termNS } from '../../../../wailsjs/go/models';
import { ConnectWith, Send, Resize, Disconnect } from '../../../../wailsjs/go/terminal/Terminal';

type SSHConn = termNS.SSHConn;

type Props = { open: boolean; onClose: () => void; cfg: SSHConn };

export default function TerminalModal({ open, onClose, cfg }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);

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

    ConnectWith({ ...cfg, Cols: term.cols, Rows: term.rows }).catch((e: any) =>
      term.write(`\r\n[erro] ${String(e)}\r\n`)
    );

    const ro = new ResizeObserver(() => {
      fit.fit();
      Resize(term.cols, term.rows);
    });
    ro.observe(hostRef.current!);

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);

    return () => {
      sub.dispose();
      offData && offData();
      offExit && offExit();
      ro.disconnect();
      window.removeEventListener('keydown', onEsc);
      Disconnect();
      term.dispose();
    };
  }, [open, cfg, onClose]);

  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <div ref={hostRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  zIndex: 9999,
  display: 'flex',
};
const panel: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  background: '#000',
  display: 'flex',
};
const closeBtn: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 12,
  zIndex: 1,
  background: 'transparent',
  border: 'none',
  color: '#9aa0a6',
  fontSize: 24,
  cursor: 'pointer',
};
