import { create } from 'zustand';
import { TerminalStateProps } from '../../interfaces/TerminalInterfaces';

export const useTerminalStore = create<TerminalStateProps>((set) => ({
  open: false,
  error: null,
  config: null,
  askPassword: false,

  openWith: (config) => {
    set({ config: config, open: true, askPassword: false });
  },
  requirePassword: (config) => set({ config: config, askPassword: true, open: false }),
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
    }),
  setError: (event) => set({ error: event }),
}));
