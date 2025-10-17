import type { terminal as termNS } from '../../wailsjs/go/models';

export type SSHConn = termNS.SSHConn;

export interface TerminalProps {
  cfg: SSHConn;
  open: boolean;
  title?: string;
  onClose: () => void;
}
