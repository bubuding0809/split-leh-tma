import { NextRequest, NextResponse } from 'next/server';
import { env } from './env';

export function middleware(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return Response.json(
      {
        error: 'No authorization header provided',
      },
      {
        status: 401,
      }
    );
  }

  const token = authorization.replace('Bearer ', '');
  if (token !== env.API_KEY) {
    return Response.json(
      {
        error: 'Invalid authorization token',
      },
      {
        status: 403,
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
