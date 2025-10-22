import type { terminal as termNS } from '../../wailsjs/go/models';

export type SSHConn = termNS.SSHConn;

export interface TerminalProps {
  open: boolean;
  title?: string;
  configure: SSHConn;
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
  alias?: string;
  userId?: number;
  systemUser: string;
  knownHosts?: string;
}

export interface EditSshConnectionModalProps extends ModalProps {
  connection: SshDto | null;
}
export interface EditSshConnectionFormProps {
  id: number;
  onSuccess?: () => void;
  connection: CreateSshConnectionInterface;
}

export interface SshDto {
  id: number;
  host: string;
  port: number;
  alias?: string;
  systemUser: string;
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
  onCreated: () => void;
}

export interface PasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export interface TerminalStateProps {
  open: boolean;
  close: () => void;
  askPassword: boolean;
  error: string | null;
  config: termNS.SSHConn | null;
  setError: (event: string | null) => void;
  openWith: (config: termNS.SSHConn) => void;
  submitPassword: (password: string) => void;
  requirePassword: (config: termNS.SSHConn) => void;
}
