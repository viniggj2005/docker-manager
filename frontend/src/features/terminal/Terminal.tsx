import { useState } from 'react';
import TerminalModal from './components/modals/TerminalModal';
import type { terminal as termNS } from '../../../wailsjs/go/models';

export default function SshTerminal() {
  const [open, setOpen] = useState(false);
  const cfgKey: termNS.SSHConn = {
    Host: import.meta.env.VITE_SSH_HOST,
    Port: 22,
    User: import.meta.env.VITE_SSH_USER,
    Password: '',
    Key: [],
    KeyPath: import.meta.env.VITE_SSH_KEYPATH,
    Passphrase: '',
    KnownHostsPath: '',
    InsecureIgnoreHostKey: true, //true
    Cols: 0,
    Rows: 0,
    Timeout: 0,
  };
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir terminal</button>
      <TerminalModal open={open} onClose={() => setOpen(false)} cfg={cfgKey} />
    </>
  );
}
