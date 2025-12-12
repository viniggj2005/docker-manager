export function FmtAgo(created?: number) {
  if (!created) return '-';
  const miliseconds = Date.now() - created * 1000;
  const seconds = Math.max(1, Math.floor(miliseconds / 1000));
  const units: [number, string][] = [
    [60, 's'],
    [60, 'min'],
    [24, 'h'],
    [7, 'd'],
    [4.345, 'sem'],
    [12, 'm'],
  ];
  let value = seconds;
  let label = 's';
  for (let index = 0; index < units.length; index++) {
    const [key, tag] = units[index];
    if (value < key) {
      label = tag;
      break;
    }
    value = Math.floor(value / key);
    label = tag;
  }
  return `${value} ${label} atrás`;
}

export function FmtName(names: string[]) {
  if (!names || names.length === 0) return '—';
  return names[0].startsWith('/') ? names[0].slice(1) : names[0];
}

export function FormatBytes(bytes?: number) {
  if (bytes === undefined || bytes === null) return '';
  if (bytes === 0) return '0 B';
  const key = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(key));
  const value = parseFloat((bytes / Math.pow(key, index)).toFixed(1));
  return `${value} ${sizes[index]}`;
}

export function ParseNameAndTag(repoTags?: string[]) {
  if (!repoTags || repoTags.length === 0) return { name: '<dangling>', tag: '<none>' };
  const first = repoTags.find((t) => !t.startsWith('<none>')) ?? repoTags[0];
  const index = first.lastIndexOf(':');
  if (index === -1) return { name: first, tag: 'latest' };
  return { name: first.slice(0, index), tag: first.slice(index + 1) };
}

export function EpochToDateStr(created?: number) {
  if (created === undefined || created === null) return '';
  const date = new Date(created < 10_000_000_000 ? created * 1000 : created);
  return date.toLocaleString();
}

export function classState(state: string) {
  const status = state?.toLowerCase();
  if (status === 'paused') return 'bg-amber-100 text-amber-700';
  if (status === 'running') return 'bg-emerald-100 text-emerald-700';
  if (status === 'exited') return 'bg-rose-100 text-red-600';
  return 'bg-gray-100 text-black';
}

export function BytesToMB(numberOfBytes: number) {
  return +(numberOfBytes / (1024 * 1024)).toFixed(1);
}
