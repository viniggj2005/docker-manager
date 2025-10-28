import { DockerCredentialSummary } from '../../../interfaces/DockerCredentialInterfaces';

export const toBase64 = (value: string) => {
  const normalized = value.replace(/\r\n/g, '\n');
  return btoa(normalized);
};

export const mapCredential = (raw: any): DockerCredentialSummary | null => {
  if (!raw) return null;
  const id = Number(raw?.ID ?? raw?.Id ?? raw?.id);
  const alias = String(raw?.Alias ?? raw?.alias ?? '').trim();
  if (!Number.isFinite(id)) return null;
  return { id, alias: alias || `Credencial #${id}` };
};
