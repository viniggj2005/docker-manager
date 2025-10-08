export function FmtAgo(created?: number) {
  if (!created) return '-';
  const ms = Date.now() - created * 1000;
  const sec = Math.max(1, Math.floor(ms / 1000));
  const units: [number, string][] = [
    [60, 's'],
    [60, 'min'],
    [24, 'h'],
    [7, 'd'],
    [4.345, 'sem'],
    [12, 'm'],
  ];
  let v = sec;
  let label = 's';
  for (let i = 0; i < units.length; i++) {
    const [k, l] = units[i];
    if (v < k) {
      label = l;
      break;
    }
    v = Math.floor(v / k);
    label = l;
  }
  return `${v} ${label} atrás`;
}

export function FmtName(names: string[]) {
  if (!names || names.length === 0) return '—';
  return names[0].startsWith('/') ? names[0].slice(1) : names[0];
}

export function FormatBytes(bytes?: number) {
  if (bytes === undefined || bytes === null) return '';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
}

export function ParseNameAndTag(repoTags?: string[]) {
  if (!repoTags || repoTags.length === 0) return { name: '<dangling>', tag: '<none>' };
  const first = repoTags.find((t) => !t.startsWith('<none>')) ?? repoTags[0];
  const idx = first.lastIndexOf(':');
  if (idx === -1) return { name: first, tag: 'latest' };
  return { name: first.slice(0, idx), tag: first.slice(idx + 1) };
}

export function EpochToDateStr(created?: number) {
  if (created === undefined || created === null) return '';
  const d = new Date(created < 10_000_000_000 ? created * 1000 : created);
  return d.toLocaleString();
}
