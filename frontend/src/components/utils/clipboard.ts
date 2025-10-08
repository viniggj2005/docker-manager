import iziToast from 'izitoast';

export const copyToClipboard = async (text: string, label = 'copiado') => {
  try {
    await navigator.clipboard.writeText(text);
    iziToast.success({ message: label, position: 'bottomRight' });
  } catch {
    iziToast.error({ title: 'Erro', message: 'Falha ao copiar', position: 'bottomRight' });
  }
};
