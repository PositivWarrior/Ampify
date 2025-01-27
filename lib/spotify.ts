const getSpotifyToken = async () => {
    const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials',
            cache: 'no-store'
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Failed to get Spotify token:', error);
        throw error;
    }
};

export { getSpotifyToken }; 