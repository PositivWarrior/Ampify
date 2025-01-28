import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Add CORS headers for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
        res.headers.set('Access-Control-Allow-Origin', '*');
        res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res;
        }
    }

    // Configure Supabase middleware client
    const supabase = createMiddlewareClient({ req, res }); // Pass req and res correctly
    await supabase.auth.getSession(); // Fetch the user session securely

    return res;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
