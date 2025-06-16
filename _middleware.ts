/*

'use client';

import { Config } from './app/Config';

export function middleware(request: NextRequest) {
    const token = localStorage.getItem(Config.tokenKey);

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/erp/:path*'],
}

*/