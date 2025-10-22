import iziToast from 'izitoast';
import { useTheme } from '../../../../hooks/use-theme';

type ConfirmOpts = {
  id?: string;
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm: () => Promise<void> | void;
};

export function useConfirmToast() {
  const { theme } = useTheme();

  const getVar = (n: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  return (options: ConfirmOpts) => {
    const bg = getVar(theme === 'dark' ? '--dark-secondary' : '--system-white');
    const fg = getVar(theme === 'dark' ? '--system-white' : '--dark-primary');
    const cls = theme === 'dark' ? 'confirm-toast--dark' : 'confirm-toast--light';
    iziToast.question({
      close: false,
      icon: 'none',
      overlay: true,
      id: options.id,
      timeout: 20000,
      titleColor: fg,
      messageColor: fg,
      position: 'center',
      backgroundColor: bg,
      message: options.message,
      class: `confirm-toast ${cls}`,
      buttons: [
        [
          '<button type="button" class="px-3 py-1 !bg-[var(--accent-green)] !border-none hover:scale-95"><span class="text-[var(--system-white)] font-bold">Sim</span></button>',
          async () => {
            try {
              await options.onConfirm();
              iziToast.success({
                title: 'Sucesso!',
                message: options.title,
                position: 'bottomRight',
              });
            } catch (error) {
              iziToast.error({ title: 'Erro', message: String(error), position: 'bottomRight' });
            }
          },
          false,
        ],
        [
          '<button type="button" class="px-3 py-1 !bg-[var(--exit-red)] hover:scale-95"><span class="text-[var(--system-white)] font-bold">Não</span></button>',
          (instance, toast) => {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            options.onCancel?.();
          },
          false,
        ],
      ],
    });
  };
}
