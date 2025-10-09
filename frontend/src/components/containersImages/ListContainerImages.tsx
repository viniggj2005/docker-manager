import Toolbar from './Toolbar';
import ImageCard from './ImageCard';
import ImagesTable from './ImagesTable';
import { useImages } from './RequestsImages';
import React, { useMemo, useState } from 'react';
import { ParseNameAndTag } from '../../functions/TreatmentFunction';
import { ViewMode } from '../../interfaces/ContainerImagesInterfaces';

const ListContainersImages: React.FC = () => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const { images, loading, fetchImages, setImages } = useImages();

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
    <div className="w-full max-w-7xl mx-auto p-4 text-[var(--system-black)]">
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
        <ImagesTable images={filteredSorted} onDeleted={handleDeleted} />
      )}

      {!loading && filteredSorted.length === 0 && (
        <div className="mt-10 text-center text-[var(--system-black)]">
          Nenhuma imagem encontrada.
        </div>
      )}
    </div>
  );
};

export default ListContainersImages;
