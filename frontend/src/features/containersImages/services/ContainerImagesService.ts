import iziToast from 'izitoast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DockerImageInfo } from '../../../interfaces/ContainerImagesInterfaces';
import { ImagesList } from '../../../../wailsjs/go/handlers/DockerSdkHandlerStruct';

export const ContainerImagesService = (pollMiliseconds = 2000) => {
  const timerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<DockerImageInfo[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const imagesList = await ImagesList();
      setImages((imagesList as DockerImageInfo[]) ?? []);
    } catch (error: any) {
      iziToast.error({
        title: 'Erro',
        message: String(error?.message ?? error),
        position: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
    timerRef.current = window.setInterval(fetchImages, pollMiliseconds);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [fetchImages, pollMiliseconds]);

  return { images, loading, fetchImages, setImages };
};
