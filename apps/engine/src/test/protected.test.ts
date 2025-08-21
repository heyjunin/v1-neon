import { describe, expect, it } from 'vitest';
import { createTestToken, expectJsonResponse, testClient } from './helpers';

describe('Protected Routes', () => {
  describe('GET /protected/profile', () => {
    it('should return user profile with valid token', async () => {
      const token = await createTestToken();
      
      const res = await testClient.request('/protected/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expectJsonResponse(res);

      const data = await res.json();
      expect(data).toMatchObject({
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
      });
    });

    it('should reject request without token', async () => {
      const res = await testClient.request('/protected/profile');
      
      expect(res.status).toBe(401);
      
      const data = await res.json();
      expect(data).toMatchObject({
        message: 'Authorization header required',
      });
    });

    it('should reject request with invalid token format', async () => {
      const res = await testClient.request('/protected/profile', {
        headers: {
          'Authorization': 'InvalidToken',
        },
      });
      
      expect(res.status).toBe(401);
      
      const data = await res.json();
      expect(data).toMatchObject({
        message: 'Authorization header required',
      });
    });

    it('should reject request with invalid JWT token', async () => {
      const res = await testClient.request('/protected/profile', {
        headers: {
          'Authorization': 'Bearer invalid.jwt.token',
        },
      });
      
      expect(res.status).toBe(401);
      
      const data = await res.json();
      expect(data).toMatchObject({
        message: 'Invalid token',
      });
    });

    it('should reject request with expired token', async () => {
      // Create a token that expires in the past
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const res = await testClient.request('/protected/profile', {
        headers: {
          'Authorization': `Bearer ${expiredToken}`,
        },
      });
      
      expect(res.status).toBe(401);
      
      const data = await res.json();
      expect(data).toMatchObject({
        message: 'Invalid token',
      });
    });
  });
});
