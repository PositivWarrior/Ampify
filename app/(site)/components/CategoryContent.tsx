'use client';

import { Song } from "@/types";
import ListItem from "@/components/ListItem";
import { useState, useEffect } from "react";

interface SpotifyCategory {
    id: string;
    name: string;
    icons: Array<{ url: string }>;
  }

  export default function CategoryContent() {
    const [selectedCategory, setSelectedCategory] = useState<SpotifyCategory | null>(null);
    const [categorySongs, setCategorySongs] = useState<Song[]>([]);

    useEffect(() => {
        const handler = (event: Event) => {
          const { category, songs } = (event as CustomEvent).detail;
          setSelectedCategory({
            id: category.id,
            name: category.name,
            icons: [{ url: category.picture_medium }]
          });
          setCategorySongs(songs);
        };
    
        window.addEventListener('categorySelect', handler);
        return () => window.removeEventListener('categorySelect', handler);
      }, []);

    if (!selectedCategory || categorySongs.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 mb-7 px-6">
            <div className="flex justify-between items-center">
                <h1 className="text-white text-2xl font-semibold">
                    {selectedCategory.name} Songs
                </h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
                {categorySongs.map((song) => (
                    <ListItem
                        key={song.id}
                        name={song.title}
                        href={`/songs/${song.id}`}
                        image={song.image_path || '/images/music-placeholder.png'}
                    />
                ))}
            </div>
        </div>
    );
} 