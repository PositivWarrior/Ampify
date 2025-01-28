import { NextResponse } from "next/server";

export async function getSpotifyToken() {
    if (typeof window !== 'undefined') {
      // Client-side: Use API route
      try {
        const response = await fetch('/api/spotify/token');
        const data = await response.json();
        return data.accessToken;
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
        return null;
      }
    } else {
      // Server-side: Fetch directly
      try {
        const authOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
              ).toString('base64'),
          },
          body: 'grant_type=client_credentials',
        };
  
        const response = await fetch(
          'https://accounts.spotify.com/api/token',
          authOptions
        );
  
        const data = await response.json();
        return data.access_token;
      } catch (error) {
        console.error('Error fetching Spotify token (server-side):', error);
        return null;
      }
    }
  }
  
  // app/api/spotify/token/route.ts
  export async function GET() {
    try {
      const authOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64')
        },
        body: 'grant_type=client_credentials'
      };
  
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await response.json();
      
      return NextResponse.json({
        accessToken: data.access_token,
        expiresIn: data.expires_in
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch Spotify token' },
        { status: 500 }
      );
    }
  }