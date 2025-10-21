import iziToast from 'izitoast';

export const confirmToast = (options: {
  id?: string;
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm: () => Promise<void> | void;
}) => {
  iziToast.question({
    icon: '',
    zindex: 99,
    close: false,
    overlay: true,
    id: options.id,
    timeout: 20000,
    displayMode: 1,
    position: 'center',
    message: options.message,
    color: 'bg-[var(--system-white)]',
    buttons: [
      [
        '<button type="button" class="!bg-[var(--accent-green)] !border-none hover:scale-95 px-3 py-1"><span class="text-[var(--system-white)] font-bold">Sim</span></button>',
        async function (instance, toast) {
          try {
            await options.onConfirm();
            iziToast.success({
              title: 'Sucesso!',
              message: options.title,
              position: 'bottomRight',
            });
          } catch (error) {
            iziToast.error({ title: 'Erro', message: String(error), position: 'bottomRight' });
          } finally {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          }
        },
        false,
      ],
      [
        '<button type="button" class="!bg-[var(--exit-red)] hover:scale-95  px-3 py-1"><span class="text-[var(--system-white)] font-bold">Não</span></button>',
        function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          options.onCancel?.();
        },
        false,
      ],
    ],
  });
};
