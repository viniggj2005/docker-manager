export interface Port {
  IP?: string;
  Type: string;
  PrivatePort: number;
  PublicPort?: number;
}

export interface NetworkSettings {
  Networks?: Record<string, { IPAddress?: string }>;
}

export interface ContainerItem {
  Id: string;
  Image: string;
  State: string;
  Ports?: Port[];
  Names: string[];
  Status?: string;
  ImageID?: string;
  Command?: string;
  Created?: number;
  Labels?: Record<string, string>;
  NetworkSettings?: NetworkSettings;
}
export interface ContainerStatsProps {
  id: string;
  name: string;
  onClose: () => void;
}

export interface EditContainerNameModalProps {
  id: string;
  name: string;
  setEditNameModal: (state: boolean) => void;
  handleRename: (newName: string, id: string) => void;
}

export interface ContainerProps {
  id: string;
  isOpen: boolean;
  name: string;
  setMenuModal: (state: boolean) => void;
  onDeleted?: () => void;
}

export interface StatsPayload {
  containerId: string;
  osType: string;
  cpuPercent: number;
  memPercent: number;
  memUsage: number;
  memLimit: number;
  rxBytes: number;
  txBytes: number;
  pids: number;
  time: number;
}

export interface LogsProps {
  id: string;
  setLogsModal: (state: boolean) => void;
}
