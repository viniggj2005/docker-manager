import { useMemo } from 'react';

const ContainersListSkeleton: React.FC = () => {
  const skeleton = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--light-gray)] bg-[var(--system-white)] p-5 shadow-md"
        >
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--light-gray)]" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded bg-[var(--light-gray)]" />
          <div className="mt-4 h-8 w-full animate-pulse rounded bg-[var(--light-gray)]" />
        </div>
      )),
    []
  );
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{skeleton}</div>;
};

export default ContainersListSkeleton;
