import { describe, expect, it } from 'vitest';
import { expectJsonResponse, testClient } from './helpers';

describe('Authentication', () => {
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
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

      expectJsonResponse(res);

      const data = await res.json();
      expect(data).toMatchObject({
        access_token: expect.any(String),
        token_type: 'Bearer',
        expires_in: 86400,
      });

      // Validate JWT token format
      expect(data.access_token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
    });

    it('should reject invalid credentials', async () => {
      const res = await testClient.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(res.status).toBe(401);
      
      const data = await res.json();
      expect(data).toMatchObject({
        message: 'Invalid credentials',
      });
    });

    it('should reject invalid email format', async () => {
      const res = await testClient.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing required fields', async () => {
      const res = await testClient.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject empty request body', async () => {
      const res = await testClient.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      });

      expect(res.status).toBe(400);
    });
  });
});
