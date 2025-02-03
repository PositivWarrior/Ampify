const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

export async function getSpotifyToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to get Spotify token:', errorText);
      throw new Error('Failed to get Spotify token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

// Add this new function for getting track previews
export async function getTrackPreviews(categoryId: string) {
  const token = await getSpotifyToken();
  if (!token) throw new Error('Failed to get Spotify token');

  // First, get some playlists from the category
  const playlistsResponse = await fetch(
    `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!playlistsResponse.ok) {
    throw new Error('Failed to fetch playlists');
  }

  const playlistsData = await playlistsResponse.json();
  const playlist = playlistsData.playlists.items[0];

  if (!playlist) {
    throw new Error('No playlists found for category');
  }

  // Then, get tracks from the first playlist that have preview URLs
  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!tracksResponse.ok) {
    throw new Error('Failed to fetch tracks');
  }

  const tracksData = await tracksResponse.json();
  
  // Filter for tracks with preview URLs and format them
  return tracksData.items
    .filter((item: any) => item.track?.preview_url)
    .map((item: any) => ({
      id: item.track.id,
      title: item.track.name,
      author: item.track.artists.map((artist: any) => artist.name).join(', '),
      song_path: item.track.preview_url,
      image_path: item.track.album.images[0]?.url || '/images/music-placeholder.png',
    }));
}
  