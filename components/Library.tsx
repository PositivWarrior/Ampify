'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song, SpotifyCategory } from '@/types';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';
import useSubscribeModal from '@/hooks/useSubscribeModal';

interface LibraryProps {
  songs: Song[];
  onCategorySelect?: (category: SpotifyCategory, songs: Song[]) => void;
}

const Library: React.FC<LibraryProps> = ({ songs, onCategorySelect }) => {
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categorySongs, setCategorySongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<SpotifyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user, subscription } = useUser();
  const onPlay = useOnPlay(songs);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/spotify/genres');
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.details || data.error);
        }

        setCategories(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchCategorySongs = async (categoryId: string) => {
    setIsLoading(true);
    setCategorySongs([]);
    setError(null);

    try {
      const response = await fetch(`/api/spotify/genre/${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { category, songs } = await response.json();
      if (!songs || !Array.isArray(songs)) {
        throw new Error('Invalid songs data received');
      }

      setCategorySongs(songs);
      onCategorySelect?.(category, songs);
    } catch (err) {
      console.error('Error fetching category songs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: SpotifyCategory) => {
    setSelectedCategory(category.id);
    fetchCategorySongs(category.id);
  };

  const displayedSongs = showAllSongs ? songs : songs.slice(0, 5);
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 3);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col bg-black border-t-4 border-gold shadow-inner-vintage">
      {/* Library Section */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-gold via-black to-black border-b-2 border-gold">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-gold" size={26} />
          <p className="text-gold font-semibold text-md tracking-widest">Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="text-gold cursor-pointer hover:text-white transition"
        />
      </div>

      <div className="flex flex-col gap-y-4 mt-4 px-3">
        {displayedSongs.map((item) => (
          <MediaItem
            onClick={(id: string) => onPlay(id)}
            key={item.id}
            data={item}
          />
        ))}
        {songs.length > 5 && (
          <button
            onClick={() => setShowAllSongs(!showAllSongs)}
            className="text-gold hover:text-white transition px-3 py-2 text-sm"
          >
            {showAllSongs ? 'Show Less' : `Show More (${songs.length - 5} more)`}
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div className="mt-8 px-5 py-6">
        <h2 className="text-gold text-lg font-semibold mb-4 tracking-wide">Categories</h2>
        <div className="flex flex-col gap-y-3">
          {isLoading ? (
            <div className="text-gold">Loading categories...</div>
          ) : (
            <>
              {displayedCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    flex items-center gap-x-3 cursor-pointer 
                    hover:scale-105 transition-transform duration-200
                    bg-black p-3 rounded-lg border border-gold
                    ${selectedCategory === category.id ? 'bg-gradient-to-r-right' : ''}
                  `}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gold">
                    <Image
                      src={category.picture_medium || '/images/liked.png'}
                      alt={category.name}
                      width={48}
                      height={48}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-gold font-medium">{category.name}</p>
                </div>
              ))}
              {categories.length > 3 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-gold hover:text-white transition mt-2 text-sm"
                >
                  {showAllCategories 
                    ? 'Show Less' 
                    : `Show More Categories (${categories.length - 3} more)`
                  }
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
