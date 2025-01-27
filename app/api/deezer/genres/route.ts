import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.deezer.com/genre', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Deezer API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Filter out unwanted genres and format the response
        if (data.data) {
            data.data = data.data
                .filter((genre: any) => genre.id !== 0 && genre.name !== "All")
                .map((genre: any) => ({
                    id: genre.id,
                    name: genre.name,
                    picture: genre.picture,
                    picture_medium: genre.picture_medium,
                    type: genre.type
                }));
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching genres from Deezer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genres', details: error.message },
            { status: 500 }
        );
    }
} 