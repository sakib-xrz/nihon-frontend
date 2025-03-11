import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("refreshToken")?.value || '';

    if (!token) { 
        return NextResponse.redirect(new URL('/login', request.url));
    }

    let decodedToken;
    try {
        decodedToken = jwtDecode(token); 
    } catch (error) {
        console.error("Invalid Token:", error.message);
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (path.startsWith('/dashboard') && decodedToken.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
