export interface DockerImageInfo {
  Id?: string;
  Size?: number;
  Created?: number;
  ParentId?: string;
  Containers?: number;
  RepoTags?: string[];
  SharedSize?: number;
  RepoDigests?: string[];
  Labels?: Record<string, string> | null;
}

export type ViewMode = 'grid' | 'table';

export interface ImageProps {
  image: DockerImageInfo;
  onDeleted?: () => void;
}

export interface ToolbarProps {
  query: string;
  view: ViewMode;
  loading: boolean;
  onRefresh: () => void;
  onDeleted?: () => void;
  setQuery: (v: string) => void;
  setView: (v: ViewMode) => void;
}
