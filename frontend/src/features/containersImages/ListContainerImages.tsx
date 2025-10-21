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
    const lowerCaseQuery = query.trim().toLowerCase();
    let imagesArray = images.slice();

    if (lowerCaseQuery) {
      imagesArray = imagesArray.filter((image) => {
        const { name, tag } = ParseNameAndTag(image.RepoTags);
        const labels = image.Labels ? JSON.stringify(image.Labels).toLowerCase() : '';
        const id = (image.Id ?? '').toLowerCase();
        return (
          name.toLowerCase().includes(lowerCaseQuery) ||
          tag.toLowerCase().includes(lowerCaseQuery) ||
          id.includes(lowerCaseQuery) ||
          labels.includes(lowerCaseQuery)
        );
      });
    }

    imagesArray.sort((a, b) => {
      const nameA = ParseNameAndTag(a.RepoTags).name.toLowerCase();
      const nameB = ParseNameAndTag(b.RepoTags).name.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return imagesArray;
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
          {filteredSorted.map((image) => (
            <ImageCard
              key={image.Id ?? Math.random().toString(36)}
              image={image}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredSorted.map((image) => (
            <ImagesTable
              key={image.Id ?? Math.random().toString(36)}
              image={image}
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
