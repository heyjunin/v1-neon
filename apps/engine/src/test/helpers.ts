import { expect } from 'vitest';
import { app } from '../index';

export const testClient = app;

export async function createTestToken() {
  const res = await testClient.request('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'password123',
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export function expectJsonResponse(res: Response, expectedStatus: number = 200) {
  expect(res.status).toBe(expectedStatus);
  expect(res.headers.get('content-type')).toContain('application/json');
  return res;
}
