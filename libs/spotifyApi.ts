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

      // Strategy 1: Try category playlists first
      const playlistsResponse = await fetch(
        `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=5&country=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let songs: any[] = [];

      if (playlistsResponse.ok) {
        const playlistsData = await playlistsResponse.json();
        const playlists = playlistsData.playlists?.items || [];

        // Get tracks from playlists
        const processedTrackIds = new Set();
        
        for (const playlist of playlists.slice(0, 3)) {
          const tracksResponse = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (tracksResponse.ok) {
            const tracksData = await tracksResponse.json();
            const playlistSongs = tracksData.items
              .filter((item: any) => {
                if (!item.track?.preview_url || processedTrackIds.has(item.track.id)) {
                  return false;
                }
                processedTrackIds.add(item.track.id);
                return true;
              })
              .map((item: any) => ({
                id: item.track.id,
                title: item.track.name,
                author: item.track.artists.map((artist: any) => artist.name).join(', '),
                song_path: item.track.preview_url,
                image_path: item.track.album.images[0]?.url || '/images/music-placeholder.png',
              }));

            songs.push(...playlistSongs);
          }
        }
      }

      // Strategy 2: If no songs from playlists, try recommendations
      if (songs.length === 0) {
        console.log('No songs from playlists, trying recommendations...');
        const genreSeed = categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const recommendationsResponse = await fetch(
          `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genreSeed}&min_popularity=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          songs = recommendationsData.tracks
            .filter((track: any) => track.preview_url)
            .map((track: any) => ({
              id: track.id,
              title: track.name,
              author: track.artists.map((artist: any) => artist.name).join(', '),
              song_path: track.preview_url,
              image_path: track.album.images[0]?.url || '/images/music-placeholder.png',
            }));
        }
      }

      // Strategy 3: If still no songs, try featured playlists
      if (songs.length === 0) {
        console.log('No songs from recommendations, trying featured playlists...');
        const featuredResponse = await fetch(
          'https://api.spotify.com/v1/browse/featured-playlists?limit=2',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          const playlists = featuredData.playlists?.items || [];

          for (const playlist of playlists) {
            const tracksResponse = await fetch(
              `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (tracksResponse.ok) {
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

              songs.push(...playlistSongs);
            }
          }
        }
      }

      return {
        category: {
          id: categoryId,
          name: categoryData.name,
          icons: categoryData.icons,
        },
        songs: songs.slice(0, 20) // Limit to 20 songs maximum
      };

    } catch (error) {
      console.error('Error in getCategoryWithSongs:', error);
      throw error;
    }
  },
}; 