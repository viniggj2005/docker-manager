import iziToast from 'izitoast';

export const confirmToast = (opts: {
  id?: string;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}) => {
  iziToast.question({
    timeout: 20000,
    icon: '',
    close: false,
    color: 'bg-[var(--system-white)]',
    overlay: true,
    displayMode: 1,
    id: opts.id,
    zindex: 99,
    message: opts.message,
    position: 'center',
    buttons: [
      [
        '<button type="button" class="!bg-[var(--accent-green)] !border-none hover:scale-95 px-3 py-1"><span class="text-[var(--system-white)] font-bold">Sim</span></button>',
        async function (instance, toast) {
          try {
            await opts.onConfirm();
            iziToast.success({
              title: 'Sucesso!',
              message: opts.title,
              position: 'bottomRight',
            });
          } catch (e) {
            iziToast.error({ title: 'Erro', message: String(e), position: 'bottomRight' });
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
          opts.onCancel?.();
        },
        false,
      ],
    ],
  });
};
