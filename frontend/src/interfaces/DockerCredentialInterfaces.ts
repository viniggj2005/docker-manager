export interface DockerCredentialSummary {
  id: number;
  alias: string;
}

export interface CreateDockerCredentialPayload {
  ca: string;
  url: string;
  key: string;
  cert: string;
  alias: string;
  userId: number;
}

export interface DockerCredentialSelectorProps {
  variant?: 'default' | 'navbar' ;
}

export interface DockerClientContextValue {
  ready: boolean;
  loading: boolean;
  connecting: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  dockerClientId: number | null;
  selectedCredentialId: number | null;
  credentials: DockerCredentialSummary[];
  setSelectedCredentialId: (credentialId: number | null) => void;
}


export interface CreateDockerCredentialModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  userId: string | number;
  refresh: () => void;
}
