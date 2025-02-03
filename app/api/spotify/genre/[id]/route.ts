import { NextResponse } from 'next/server';
import { spotifyApi } from '@/libs/spotifyApi';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    
    if (!categoryId) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const data = await spotifyApi.getCategoryWithSongs(categoryId);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in genre route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
