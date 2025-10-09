import iziToast from 'izitoast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ImagesList, PruneImages } from '../../../wailsjs/go/docker/Docker';
import { DockerImageInfo } from '../../interfaces/ContainerImagesInterfaces';

export const useImages = (pollMs = 2000) => {
  const timerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<DockerImageInfo[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ImagesList();
      setImages((res as DockerImageInfo[]) ?? []);
    } catch (e: any) {
      iziToast.error({ title: 'Erro', message: String(e?.message ?? e), position: 'bottomRight' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
    timerRef.current = window.setInterval(fetchImages, pollMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [fetchImages, pollMs]);

  return { images, loading, fetchImages, setImages };
};
