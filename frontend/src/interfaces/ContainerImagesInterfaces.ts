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
