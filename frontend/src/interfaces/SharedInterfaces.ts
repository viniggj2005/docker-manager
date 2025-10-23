export interface InspectProps {
  name?: string;
  title?: string;
  onClose: () => void;
  data?: string | null;
}

export interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export interface AppShellProps {
  children: React.ReactNode;
}
