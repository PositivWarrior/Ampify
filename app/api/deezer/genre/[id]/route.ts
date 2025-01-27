import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!params.id) {
        return NextResponse.json(
            { error: 'Missing genre ID' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(`https://api.deezer.com/genre/${params.id}/tracks?limit=10`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || `Deezer API error: ${response.status}`);
        }

        // Transform the data to match your Song type
        const formattedData = {
            data: data.data?.map((track: any) => ({
                id: track.id.toString(),
                title: track.title,
                author: track.artist.name,
                song_path: track.preview,
                image_path: track.album.cover_medium,
            })) || []
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching from Deezer:', errorMessage);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch data',
                details: errorMessage
            },
            { status: 500 }
        );
    }
} 