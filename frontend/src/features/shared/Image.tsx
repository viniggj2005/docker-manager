import { useEffect, useState } from 'react';
import { LoadImage } from '../../../wailsjs/go/main/App';

const ImagemView = () => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      const img = await LoadImage('teste.png');
      setSrc(img);
    };
    fetchImage();
  }, []);

  return <img src={src} alt="imagem" />;
};
export default ImagemView;


