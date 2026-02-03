import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for Supabase auth cookie
    const supabaseUrl = process.env.SBASE_URL;
    const supabaseAnonKey = process.env.SBASE_ANON_KEY;

    // If Supabase is not configured, allow access (development mode)
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase not configured - auth bypass enabled");
        return NextResponse.next();
    }

    // Get auth token from cookies
    const authCookie = request.cookies.get("sb-access-token")?.value
        || request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value;

    if (!authCookie) {
        // No auth cookie - redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Parse the auth cookie (it's a JSON array with token info)
    try {
        const tokenData = JSON.parse(authCookie);
        const accessToken = Array.isArray(tokenData) ? tokenData[0] : tokenData?.access_token;

        if (!accessToken) {
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the token with Supabase
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: { persistSession: false },
        });

        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        // User is authenticated
        return NextResponse.next();
    } catch {
        // Invalid cookie format - redirect to login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
