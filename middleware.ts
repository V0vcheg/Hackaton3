import { NextResponse, NextRequest } from 'next/server'

// List public paths that shouldn’t require a token
const publicPaths = ['/login', '/register', '/_next', '/favicon.ico']
const apiPublicPaths = ['/api/auth', '/api/public']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. If this is a public path, let it through
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }
    if (apiPublicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // 2. Otherwise, check for our auth token
    const token = request.cookies.get('token')?.value

    // 3. If no token, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // 4. Token present — allow
    return NextResponse.next()
}

// Only run this middleware on your “auth” folder (and its sub-paths)
export const config = {
    matcher: ['/:path*']
}
