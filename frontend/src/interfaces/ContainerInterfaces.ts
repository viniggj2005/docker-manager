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
  name: string;
  isOpen: boolean;
  onDeleted?: () => void;
  setMenuModal: (state: boolean) => void;
}

export interface StatsPayload {
  pids: number;
  time: number;
  osType: string;
  txBytes: number;
  rxBytes: number;
  memUsage: number;
  memLimit: number;
  cpuPercent: number;
  memPercent: number;
  containerId: string;
}

export interface LogsProps {
  id: string;
  setLogsModal: (state: boolean) => void;
}
