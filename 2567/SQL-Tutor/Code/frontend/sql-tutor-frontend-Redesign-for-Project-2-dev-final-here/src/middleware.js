import { NextResponse } from 'next/server';

export default function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|public/.*|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp)).*)',
    '/(api|trpc)(.*)',
  ],
};
