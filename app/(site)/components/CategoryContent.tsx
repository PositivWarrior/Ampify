'use client';
import { useState, useEffect } from 'react';
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song, SpotifyCategory } from '@/types';

export default function CategoryContent() {
  const [selectedCategory, setSelectedCategory] = useState<SpotifyCategory | null>(null);
  const [categorySongs, setCategorySongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const onPlay = useOnPlay(categorySongs);

  useEffect(() => {
    const handler = (event: Event) => {
      const { category, songs } = (event as CustomEvent).detail;

      if (!category || !songs.length) {
        setError('No songs available for this category.');
        return;
      }

      setError(null);
      setSelectedCategory(category);
      setCategorySongs(songs);
    };

    window.addEventListener('categorySelect', handler);
    return () => window.removeEventListener('categorySelect', handler);
  }, []);

  if (error) {
    return <p className="text-neutral-400 text-center mt-4">{error}</p>;
  }

  if (!selectedCategory || categorySongs.length === 0) {
    return (
      <div className="mt-4 text-neutral-400">
        Select a category to view songs
      </div>
    );
  }

  return (
    <div className="mt-2 mb-7 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">
          {selectedCategory.name} Songs
        </h1>
      </div>
      <div 
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-8
          gap-4
          mt-4
        "
      >
        {categorySongs.map((item) => (
          <SongItem
            key={item.id}
            onClick={(id: string) => onPlay(id)}
            data={item}
          />
        ))}
      </div>
    </div>
  );
}
