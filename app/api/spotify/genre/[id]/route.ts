import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/spotify';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!params.id) {
        return NextResponse.json(
            { error: 'Missing category ID' },
            { status: 400 }
        );
    }

    try {
        const token = await getSpotifyToken();
        
        // First get a playlist for this category
        const playlistResponse = await fetch(
            `https://api.spotify.com/v1/browse/categories/${params.id}/playlists?limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                next: { revalidate: 3600 }
            }
        );

        const playlistData = await playlistResponse.json();

        if (!playlistResponse.ok || playlistData.error) {
            throw new Error(playlistData.error?.message || `Spotify API error: ${playlistResponse.status}`);
        }

        const playlistId = playlistData.playlists.items[0]?.id;
        if (!playlistId) {
            throw new Error('No playlist found for this category');
        }

        // Then get tracks from that playlist
        const tracksResponse = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                next: { revalidate: 3600 }
            }
        );

        const tracksData = await tracksResponse.json();

        if (!tracksResponse.ok || tracksData.error) {
            throw new Error(tracksData.error?.message || `Spotify API error: ${tracksResponse.status}`);
        }

        // Transform the data to match your Song type
        const formattedData = {
            data: tracksData.items.map((item: any) => ({
                id: item.track.id,
                title: item.track.name,
                author: item.track.artists.map((artist: any) => artist.name).join(', '),
                song_path: item.track.preview_url,
                image_path: item.track.album.images[1]?.url || item.track.album.images[0]?.url,
            })).filter((track: any) => track.song_path) // Only include tracks with preview URLs
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching from Spotify:', errorMessage);
        
        return NextResponse.json(
            { error: 'Failed to fetch data', details: errorMessage },
            { status: 500 }
        );
    }
} 