import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing, {
    localeDetection: false,
});

export default function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/_next/')) {
        
        return NextResponse.next();
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)',
    ],
};
