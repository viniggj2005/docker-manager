export interface VolumeItem {
  Name: string;
  Driver?: string;
  Mountpoint?: string;
  CreatedAt?: string;
  Scope?: string;
  Labels?: Record<string, string> | null;
  Options?: Record<string, string> | null;
  UsageData?: {
    RefCount?: number;
    Size?: number;
  } | null;
}

export interface VolumeListResponse {
  Volumes?: VolumeItem[] | null;
  Warnings?: string[] | null;
}
