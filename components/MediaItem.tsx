'use client'

import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick,
}) => {
    const imageUrl = useLoadImage(data)

    const handleClick = () => {
        if (onClick) {
            onClick(data.id);
        }

        // TODO: default turn on player
    }
 
    return (
        <div
        onClick={handleClick}
        className="
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-gradient-to-r
        hover:from-gold
        hover:to-black
        hover:shadow-vintage
        w-full
        p-2
        rounded-lg
        bg-black
        border
        border-gold
        "
    >
        <div
            className="
            relative
            rounded-lg
            min-h-[48px]
            min-w-[48px]
            overflow-hidden
            border
            border-gold
            "
        >
            <Image
                fill
                src={imageUrl || '/images/liked.png'}
                alt="Media Item"
                className="object-cover"
            />
        </div>
        <div
            className="
            flex
            flex-col
            gap-y-1
            overflow-hidden
            "
        >
            <p className="text-gold truncate text-md font-semibold tracking-wider">
                {data.title}
            </p>
            <p className="text-neutral-400 text-sm truncate">
                {data.author}
            </p>
        </div>
    </div>
);
};

export default MediaItem;