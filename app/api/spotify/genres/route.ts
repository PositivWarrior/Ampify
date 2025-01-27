import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/spotify';

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
        const token = await getSpotifyToken();
        
        const response = await fetch('https://api.spotify.com/v1/browse/categories?limit=50&country=US', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: 3600 }
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || `Spotify API error: ${response.status}`);
        }

        // Transform the data to match our format
        const formattedData = {
            data: data.categories.items.map((category: any) => ({
                id: category.id,
                name: category.name,
                picture: category.icons[0]?.url || '/images/liked.png',
                picture_medium: category.icons[0]?.url || '/images/liked.png',
                picture_big: category.icons[0]?.url || '/images/liked.png',
                type: 'genre'
            }))
        };

        // console.log('Formatted categories:', formattedData); // For debugging

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error fetching from Spotify:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genres', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 