// __tests__/middleware.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '#/middleware';

describe('NextJS Middleware', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = new NextRequest(new Request('http://localhost:3000/api/chat'), {
      headers: {
        'content-type': 'application/json',
      },
    });
  });

  it('should allow requests with valid authorization', async () => {
    const request = new NextRequest(mockRequest, {
      headers: {
        authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const response = middleware(request);
    expect(response.status).toBe(200);
  });

  it('should block requests without authorization', async () => {
    const response = middleware(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'No authorization header provided',
    });
  });

  it('should block requests with invalid token', async () => {
    const request = new NextRequest(mockRequest, {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });

    const response = middleware(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({
      error: 'Invalid authorization token',
    });
  });
});
