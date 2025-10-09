export type Port = {
  IP?: string;
  Type: string;
  PrivatePort: number;
  PublicPort?: number;
};

export type NetworkSettings = {
  Networks?: Record<string, { IPAddress?: string }>;
};

export type ContainerItem = {
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
};

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
