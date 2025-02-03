import { NextResponse } from 'next/server';
import { spotifyApi } from '@/libs/spotifyApi';

interface SpotifyCategory {
    id: string;
    name: string;
    icons: Array<{
        url: string;
        height: number;
        width: number;
    }>;
}

interface SpotifyResponse {
    categories: {
        items: SpotifyCategory[];
    };
}

export async function GET() {
    try {
        const categories = await spotifyApi.getCategories();
        return NextResponse.json({ data: categories });
    } catch (error) {
        console.error('Error in genres route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genres' },
            { status: 500 }
        );
    }
} 