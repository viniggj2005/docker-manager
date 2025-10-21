import { SshDto } from '../../../interfaces/TerminalInterfaces';

export function normalizeKey(key: SshDto['key']): Uint8Array {
  if (!key) return new Uint8Array();
  if (typeof key === 'string') return new TextEncoder().encode(key);
  return new Uint8Array(key);
}
