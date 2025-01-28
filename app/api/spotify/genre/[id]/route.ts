import { NextResponse } from 'next/server';
import { getSpotifyToken } from '@/lib/spotify';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id: categoryId } = context.params;

    if (!categoryId || categoryId.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid or missing category ID' },
        { status: 400 }
      );
    }

    const token = await getSpotifyToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Spotify token unavailable' },
        { status: 401 }
      );
    }

    console.log('Fetching details for category ID:', categoryId);

    // Fetch category details
    const categoryResponse = await fetch(
      `https://api.spotify.com/v1/browse/categories/${categoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!categoryResponse.ok) {
      const error = await categoryResponse.json();
      console.error('Spotify API Error (Category):', error);
      throw new Error('Failed to fetch category details');
    }

    const categoryData = await categoryResponse.json();

    // Fetch playlists for the category
    const playlistsResponse = await fetch(
      `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!playlistsResponse.ok) {
      const error = await playlistsResponse.json();
      console.error('Spotify API Error (Playlists):', error);
      throw new Error('Failed to fetch category playlists');
    }

    const playlistsData = await playlistsResponse.json();

    const formattedData = {
      category: {
        id: categoryId,
        name: categoryData.name,
        icons: categoryData.icons,
      },
      playlists: playlistsData.playlists.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        images: item.images,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error in Spotify API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
