import { create } from 'zustand';
import { TerminalStateProps } from '../../interfaces/TerminalInterfaces';

export const useTerminalStore = create<TerminalStateProps>((set) => ({
  open: false,
  error: null,
  config: null,
  containerId: null,
  containerName: null,
  askPassword: false,

  openWith: (config) => {
    set({ config: config, containerId: null, containerName: null, open: true, askPassword: false });
  },
  openForContainer: (id, name) => {
    set({ config: null, containerId: id, containerName: name, open: true, askPassword: false });
  },
  requirePassword: (config) => set({ config: config, containerId: null, containerName: null, askPassword: true, open: false }),
  submitPassword: (password) =>
    set((storeState) =>
      storeState.config
        ? { config: { ...storeState.config, Password: password }, askPassword: false, open: true }
        : {}
    ),
  close: () =>
    set({
      open: false,
      askPassword: false,
      config: null,
      containerId: null,
      containerName: null,
    }),
  setError: (event) => set({ error: event }),
}));
