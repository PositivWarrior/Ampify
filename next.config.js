
    /** @type {import('next').NextConfig} */
        const nextConfig = {
            images: {
                remotePatterns: [
                    { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 't.scdn.co' },
      { protocol: 'https', hostname: 'mosaic.scdn.co' },
      { protocol: 'https', hostname: 'wrapped-images.spotifycdn.com' },
      { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },
      { protocol: 'https', hostname: 'hrczewiqakelnrfbxsrl.supabase.co' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
                ]
            }
};

module.exports = nextConfig;