import iziToast from 'izitoast';
import {
  ContainersList,
  ContainerPause,
  ContainerRename,
  ContainerUnPause,
} from '../../../../wailsjs/go/docker/Docker';
import { ContainerItem } from '../../../interfaces/ContainerInterfaces';

export const getContainers = async (): Promise<ContainerItem[]> => {
  try {
    const resp = await ContainersList();
    return resp || [];
  } catch (e: any) {
    iziToast.error({ title: 'Erro', message: e, position: 'bottomRight' });
    throw e;
  }
};

export const renameContainer = async (id: string, name: string): Promise<void> => {
  try {
    await ContainerRename(id, name);
  } catch (e: any) {
    iziToast.error({ title: 'Erro', message: e, position: 'bottomRight' });
    throw e;
  }
};

export const toggleContainerState = async (id: string, state: string): Promise<void> => {
  try {
    if (state === 'paused') await ContainerUnPause(id);
    else if (state === 'running') await ContainerPause(id);
  } catch (e: any) {
    iziToast.error({ title: 'Erro', message: e, position: 'bottomRight' });
    throw e;
  }
};
