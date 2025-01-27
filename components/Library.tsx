'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';
import useSubscribeModal from '@/hooks/useSubscribeModal';

interface LibraryProps {
    songs: Song[];
    onCategorySelect?: (category: SpotifyCategory, songs: Song[]) => void;
}

interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
        images: Array<{ url: string }>;
    };
    preview_url: string;
}

interface SpotifyCategory {
    id: string;
    name: string;
    picture: string;
    picture_medium: string;
    picture_big: string;
    type: string;
}

const FALLBACK_CATEGORIES = [
    {
        id: "pop",
        name: "Pop",
        picture: "/images/genres/pop.png",
        picture_medium: "/images/genres/pop.png",
        picture_big: "/images/genres/pop.png",
        type: "genre"
    },
    {
        id: "hiphop",
        name: "Hip Hop",
        picture: "/images/genres/hiphop.png",
        picture_medium: "/images/genres/hiphop.png",
        picture_big: "/images/genres/hiphop.png",
        type: "genre"
    },
    {
        id: "rock",
        name: "Rock",
        picture: "/images/genres/rock.png",
        picture_medium: "/images/genres/rock.png",
        picture_big: "/images/genres/rock.png",
        type: "genre"
    }
];

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

                if (data.data && Array.isArray(data.data)) {
                    setCategories(data.data);
                    setError(null);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories from server. Using fallback data.');
                setCategories(FALLBACK_CATEGORIES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

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

    const fetchCategorySongs = async (categoryId: string) => {
        setIsLoading(true);
        setCategorySongs([]);
        setError(null);
        
        try {
            const response = await fetch(`/api/spotify/genre/${categoryId}`);
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error?.details || data.error || 'Failed to fetch songs');
            }

            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid data format received');
            }

            setCategorySongs(data.data);
            
            if (onCategorySelect) {
                const selectedCategoryData = categories.find(c => c.id === categoryId);
                if (selectedCategoryData) {
                    onCategorySelect(selectedCategoryData, data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching category songs:', error);
            setError(error instanceof Error ? error.message : 'Failed to load songs');
            setCategorySongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryClick = (category: SpotifyCategory) => {
        setSelectedCategory(category.id);
        fetchCategorySongs(category.id);
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
                <h2 className="text-gold text-lg font-semibold mb-4 tracking-wide">
                    Categories
                </h2>
                <div className="flex flex-col gap-y-3">
                    {isLoading ? (
                        <div className="text-gold">Loading categories...</div>
                    ) : (
                        displayedCategories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className={`
                                    flex items-center gap-x-3 cursor-pointer 
                                    hover:scale-105 transition-transform duration-200
                                    bg-black p-3 rounded-lg border border-gold
                                    hover:bg-gradient-to-r-right hover:shadow-lg hover:shadow-gold
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
                        ))
                    )}
                    {categories.length > 3 && (
                        <button 
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="text-gold hover:text-white transition px-3 py-2 text-sm"
                        >
                            {showAllCategories ? 'Show Less' : `Show More (${categories.length - 3} more)`}
                        </button>
                    )}
                </div>

                {/* Category Songs */}
                {isLoading ? (
                    <div className="text-gold mt-4">Loading songs...</div>
                ) : (
                    selectedCategory && categorySongs.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-gold font-medium mb-3">
                                {categories.find(c => c.id === selectedCategory)?.name} Songs
                            </h3>
                            <div className="flex flex-col gap-y-2">
                                {categorySongs.map((song) => (
                                    <MediaItem
                                        key={song.id}
                                        onClick={(id: string) => onPlay(id)}
                                        data={song}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                )}

                {error && (
                    <div className="text-red-500 mt-4 px-3">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
