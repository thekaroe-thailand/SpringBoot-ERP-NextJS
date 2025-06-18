import { NextRequest, NextResponse } from 'next/server';
import { Config } from './app/Config';

export function middleware(request: NextRequest) {
    const token = request.cookies.get(Config.tokenKey)?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/erp/:path*'],
}