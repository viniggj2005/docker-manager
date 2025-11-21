import iziToast from 'izitoast';
import {
  ContainersList,
  ContainerPause,
  ContainerRename,
  ContainerUnPause,
} from '../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';
import { ContainerItem } from '../../../interfaces/ContainerInterfaces';

export const getContainers = async (clientId: number): Promise<ContainerItem[]> => {
  try {
    const response = await ContainersList(clientId);
    return response || [];
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};

export const renameContainer = async (
  clientId: number,
  id: string,
  name: string
): Promise<void> => {
  try {
    await ContainerRename(clientId, id, name);
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};

export const toggleContainerState = async (
  clientId: number,
  id: string,
  state: string
): Promise<void> => {
  try {
    if (state === 'paused') await ContainerUnPause(clientId, id);
    else if (state === 'running') await ContainerPause(clientId, id);
  } catch (error: any) {
    iziToast.error({ title: 'Erro', message: error, position: 'bottomRight' });
    throw error;
  }
};
