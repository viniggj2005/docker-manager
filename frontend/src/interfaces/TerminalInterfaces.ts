import type { terminal as termNS } from '../../wailsjs/go/models';

export type SSHConn = termNS.SSHConn;

export interface TerminalProps {
  cfg: SSHConn;
  open: boolean;
  title?: string;
  onClose: () => void;
}

export interface TerminalHeaderProps {
  title: string;
  docked: boolean;
  maximized: boolean;
  onClose: () => void;
  onToggleMax: () => void;
  onToggleDock: () => void;
}

export interface CreateSshConnectionInterface {
  host: string;
  key?: string;
  port?: number;
  userId: number;
  systemUser: string;
  knownHosts?: string;
}
