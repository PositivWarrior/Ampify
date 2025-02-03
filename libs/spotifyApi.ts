const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials');
  }

  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Spotify access token:', error);
    throw error;
  }
};

export const spotifyApi = {
  async getCategories() {
    const token = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/browse/categories?limit=50', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories.items.map((category: any) => ({
      id: category.id,
      name: category.name,
      picture_medium: category.icons[0]?.url,
    }));
  },

  async getCategoryWithSongs(categoryId: string) {
    const token = await getAccessToken();

    try {
      // Get category details
      const categoryResponse = await fetch(
        `https://api.spotify.com/v1/browse/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!categoryResponse.ok) {
        console.error('Category fetch error:', await categoryResponse.text());
        throw new Error('Failed to fetch category');
      }

      const categoryData = await categoryResponse.json();

      // Get category playlists
      const playlistsResponse = await fetch(
        `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=5&country=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If category has no playlists, try recommendations
      if (!playlistsResponse.ok) {
        console.log('No playlists found for category, fetching recommendations instead');
        
        // Get recommendations based on genre seed
        const recommendationsResponse = await fetch(
          `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!recommendationsResponse.ok) {
          console.error('Recommendations fetch error:', await recommendationsResponse.text());
          return {
            category: {
              id: categoryId,
              name: categoryData.name,
              icons: categoryData.icons,
            },
            songs: [] // Return empty songs array if both attempts fail
          };
        }

        const recommendationsData = await recommendationsResponse.json();
        const songs = recommendationsData.tracks
          .filter((track: any) => track.preview_url)
          .map((track: any) => ({
            id: track.id,
            title: track.name,
            author: track.artists.map((artist: any) => artist.name).join(', '),
            song_path: track.preview_url,
            image_path: track.album.images[0]?.url || '/images/music-placeholder.png',
          }));

        return {
          category: {
            id: categoryId,
            name: categoryData.name,
            icons: categoryData.icons,
          },
          songs
        };
      }

      const playlistsData = await playlistsResponse.json();
      const playlists = playlistsData.playlists.items;

      if (!playlists || playlists.length === 0) {
        return {
          category: {
            id: categoryId,
            name: categoryData.name,
            icons: categoryData.icons,
          },
          songs: []
        };
      }

      // Get tracks from all playlists
      const allSongs = [];
      for (const playlist of playlists.slice(0, 2)) { // Limit to 2 playlists for performance
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!tracksResponse.ok) {
          console.error('Tracks fetch error:', await tracksResponse.text());
          continue; // Skip this playlist if there's an error
        }

        const tracksData = await tracksResponse.json();
        const playlistSongs = tracksData.items
          .filter((item: any) => item.track?.preview_url)
          .map((item: any) => ({
            id: item.track.id,
            title: item.track.name,
            author: item.track.artists.map((artist: any) => artist.name).join(', '),
            song_path: item.track.preview_url,
            image_path: item.track.album.images[0]?.url || '/images/music-placeholder.png',
          }));

        allSongs.push(...playlistSongs);
      }

      return {
        category: {
          id: categoryId,
          name: categoryData.name,
          icons: categoryData.icons,
        },
        songs: allSongs,
      };

    } catch (error) {
      console.error('Error in getCategoryWithSongs:', error);
      throw error;
    }
  },
}; 