import { createPortal } from 'react-dom';
import { useTerminalStore } from './TerminalStore';
import TerminalModal from './components/modals/TerminalModal';
import PasswordModal from './components/modals/PasswordModal';

function ensureRoot(): HTMLElement {
  let terminalElement = document.getElementById('terminal-root') as HTMLElement | null;
  if (!terminalElement) {
    terminalElement = document.createElement('div');
    terminalElement.id = 'terminal-root';
    document.body.appendChild(terminalElement);
  }
  return terminalElement;
}

export default function GlobalTerminalHost() {
  const root = ensureRoot();
  const { open, config, askPassword, close, submitPassword } = useTerminalStore();

  return createPortal(
    <>
      {open && config && <TerminalModal open={true} onClose={close} configure={config} />}
      <PasswordModal open={askPassword} onClose={close} onSubmit={(pwd) => submitPassword(pwd)} />
    </>,
    root
  );
}
