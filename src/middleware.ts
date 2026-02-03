import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Homepage (/) is the login page - always public
// /auth/callback handles magic link tokens
const PUBLIC_ROUTES = ["/", "/auth/callback"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (pathname === "/" || PUBLIC_ROUTES.some((route) => route !== "/" && pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get Supabase project reference from URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SBASE_URL;

    if (!supabaseUrl) {
        // Supabase not configured - allow access (development mode)
        console.warn("Supabase not configured - auth bypass enabled");
        return NextResponse.next();
    }

    // Extract project reference from Supabase URL
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

    // Check for Supabase auth cookies - the library stores them in various formats
    // Modern format: sb-{projectRef}-auth-token (contains JSON array)
    // Also check for access token directly
    const allCookies = request.cookies.getAll();

    // Debug: log all cookies (remove in production)
    // console.log("All cookies:", allCookies.map(c => c.name));

    // Check for any Supabase auth-related cookies
    const hasAuthCookie = allCookies.some(cookie => {
        const name = cookie.name.toLowerCase();
        return (
            name.includes('sb-') &&
            (name.includes('auth-token') || name.includes('access-token') || name.includes('refresh-token'))
        ) || name.startsWith('sb-') && name.endsWith('-auth-token');
    });

    // Also check for the specific project auth token
    const projectAuthCookie = request.cookies.get(`sb-${projectRef}-auth-token`)?.value;

    // Check if we have a valid auth cookie
    if (hasAuthCookie || projectAuthCookie) {
        // Has some form of auth cookie - allow access
        // The client-side Supabase will validate the actual token
        return NextResponse.next();
    }

    // No auth cookie found - redirect to login
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder assets
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
