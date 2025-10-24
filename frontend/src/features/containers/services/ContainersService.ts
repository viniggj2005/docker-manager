import iziToast from 'izitoast';
import {
  ContainersList,
  ContainerPause,
  ContainerRename,
  ContainerUnPause,
} from '../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';
import { ContainerItem } from '../../../interfaces/ContainerInterfaces';

export const getContainers = async (): Promise<ContainerItem[]> => {
  try {
    const response = await ContainersList();
    return response || [];
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};

export const renameContainer = async (id: string, name: string): Promise<void> => {
  try {
    await ContainerRename(id, name);
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};

export const toggleContainerState = async (id: string, state: string): Promise<void> => {
  try {
    if (state === 'paused') await ContainerUnPause(id);
    else if (state === 'running') await ContainerPause(id);
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};
