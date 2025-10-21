import type { terminal as termNS } from '../../wailsjs/go/models';

export type SSHConn = termNS.SSHConn;

export interface TerminalProps {
  configure: SSHConn;
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

export interface SshDto {
  id: number;
  host: string;
  port: number;
  systemUser: string;
  name?: string | null;
  keyPath?: string | null;
  passphrase?: string | null;
  key?: number[] | string | null;
  knownHostsData?: string | null;
}

export interface ConnectionProps {
  token: string;
  onConnect: (id: number) => void;
}

export interface OpenTerminalProps {
  id: number;
  autoOpen?: boolean;
  onClose?: () => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}
