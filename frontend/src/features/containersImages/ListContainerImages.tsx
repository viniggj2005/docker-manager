import React, { useMemo, useState } from 'react';
import Toolbar from './components/toolbar/Toolbar';
import ImageCard from './components/cards/ImageCard';
import ImagesTable from './components/tables/ImagesTable';
import { ViewMode } from '../../interfaces/ContainerImagesInterfaces';
import { ParseNameAndTag } from '../shared/functions/TreatmentFunction';
import { ContainerImagesService } from './services/ContainerImagesService';

const ListContainersImages: React.FC = () => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const { images, loading, fetchImages } = ContainerImagesService();

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = images.slice();

    if (q) {
      arr = arr.filter((img) => {
        const { name, tag } = ParseNameAndTag(img.RepoTags);
        const labels = img.Labels ? JSON.stringify(img.Labels).toLowerCase() : '';
        const id = (img.Id ?? '').toLowerCase();
        return (
          name.toLowerCase().includes(q) ||
          tag.toLowerCase().includes(q) ||
          id.includes(q) ||
          labels.includes(q)
        );
      });
    }

    arr.sort((a, b) => {
      const na = ParseNameAndTag(a.RepoTags).name.toLowerCase();
      const nb = ParseNameAndTag(b.RepoTags).name.toLowerCase();
      return na.localeCompare(nb);
    });

    return arr;
  }, [images, query]);

  const handleDeleted = () => {
    fetchImages();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 text-[var(--system-black)] dark:text-[var(--system-white)]">
      <Toolbar
        view={view}
        query={query}
        setView={setView}
        loading={loading}
        setQuery={setQuery}
        onRefresh={fetchImages}
        onDeleted={handleDeleted}
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSorted.map((img) => (
            <ImageCard
              key={img.Id ?? Math.random().toString(36)}
              img={img}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredSorted.map((img) => (
            <ImagesTable
              key={img.Id ?? Math.random().toString(36)}
              img={img}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {!loading && filteredSorted.length === 0 && (
        <div className="mt-10 text-center text-[var(--system-black)] dark:text-[var(--system-white)]">
          Nenhuma imagem encontrada.
        </div>
      )}
    </div>
  );
};

export default ListContainersImages;
