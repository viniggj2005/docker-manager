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

export type SelectVariant = 'default' | 'navbar';

export interface SelectOption {
  value: string;
  disabled?: boolean;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  options: SelectOption[];
  variant?: SelectVariant;
  'aria-labelledby'?: string;
  placeholder?: React.ReactNode;
  noOptionsMessage?: React.ReactNode;
  onChange?: (value: string) => void;
}
