'use client';

import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';
import useSubscribeModal from '@/hooks/useSubscribeModal';

interface LibraryProps {
    songs: Song[];
}

const categories = [
    { id: 1, name: 'Rock', image: 'https://plus.unsplash.com/premium_photo-1681876467464-33495108737c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9jayUyMG11c2ljfGVufDB8fDB8fHww' },
    { id: 2, name: 'Jazz', image: 'https://images.unsplash.com/photo-1503853585905-d53f628e46ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF6enxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 3, name: 'Blues', image: 'https://images.unsplash.com/photo-1515985280712-e5358accfcb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ymx1ZXN8ZW58MHx8MHx8fDA%3D' },
    { id: 4, name: 'Pop', image: 'https://plus.unsplash.com/premium_photo-1675204863039-06b01739f87a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9wfGVufDB8fDB8fHww' },
    { id: 5, name: 'Classical', image: 'https://images.unsplash.com/photo-1519683384663-c9b34271669a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xhc3NpY2FsJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D' },
    { id: 6, name: 'Hip-Hop', image: 'https://images.unsplash.com/photo-1629753863735-4c9ba15bc10b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcCUyMGhvcHxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 7, name: 'Country', image: 'https://images.unsplash.com/photo-1649640270630-792144eaa5d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvdW50cnklMjBtdXNpY3xlbnwwfHwwfHx8MA%3D%3D' },
    { id: 8, name: 'Electronic', image: 'https://images.unsplash.com/photo-1599423424751-54e0c1187a02?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3Ryb25pYyUyMG11c2ljfGVufDB8fDB8fHww' },
    { id: 9, name: 'Reggae', image: 'https://images.unsplash.com/photo-1647208976651-d328633e9628?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlZ2dhZXxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 10, name: 'Folk', image: 'https://plus.unsplash.com/premium_photo-1682293778880-17b787f9606b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZvbGslMjBtdXNpY3xlbnwwfHwwfHx8MA%3D%3D' },
];

const Library: React.FC<LibraryProps> = ({ songs }) => {
    const subscribeModal = useSubscribeModal();
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const { user, subscription } = useUser();

    const onPlay = useOnPlay(songs);

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
                {songs.map((item) => (
                    <MediaItem
                        onClick={(id: string) => onPlay(id)}
                        key={item.id}
                        data={item}
                    />
                ))}
            </div>

            {/* Categories Section */}
            <div className="mt-8 px-5 py-6">
                <h2 className="text-gold text-lg font-semibold mb-4 tracking-wide">
                    Categories
                </h2>
                <div className="flex flex-col gap-y-3">
                    {categories.map((category) => (
                       <div
                       key={category.id}
                       className="
                       flex items-center gap-x-3 cursor-pointer 
                       hover:scale-105 transition-transform duration-200
                       bg-black p-3 rounded-lg border border-gold
                       hover:bg-gradient-to-r-right hover:shadow-lg hover:shadow-gold
                       "
                     >
                       <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gold">
                         <img
                           src={category.image}
                           alt={category.name}
                           className="object-cover w-full h-full"
                         />
                       </div>
                       <p className="text-gold font-medium">{category.name}</p>
                     </div>
                     
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
