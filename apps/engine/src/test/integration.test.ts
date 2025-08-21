import { describe, expect, it } from 'vitest';
import { expectJsonResponse, testClient } from './helpers';

describe('Integration Tests', () => {
  it('should handle complete authentication flow', async () => {
    // 1. Check health endpoint
    const healthRes = await testClient.request('/health');
    expectJsonResponse(healthRes);
    
    const healthData = await healthRes.json();
    expect(healthData.status).toBe('ok');

    // 2. Login to get token
    const loginRes = await testClient.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
      }),
    });

    expectJsonResponse(loginRes);
    const loginData = await loginRes.json();
    expect(loginData.access_token).toBeDefined();

    // 3. Use token to access protected route
    const profileRes = await testClient.request('/protected/profile', {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    expectJsonResponse(profileRes);
    const profileData = await profileRes.json();
    expect(profileData.email).toBe('admin@example.com');
  });

  it('should handle root endpoint', async () => {
    const res = await testClient.request('/');
    expectJsonResponse(res);

    const data = await res.json();
    expect(data).toMatchObject({
      message: 'V1 Engine API',
      version: '1.0.0',
      docs: '/docs',
      swagger: '/swagger',
    });
  });

  it('should handle 404 for unknown routes', async () => {
    const res = await testClient.request('/unknown-route');
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data).toMatchObject({
      message: 'Not Found',
    });
  });

  it('should handle CORS headers', async () => {
    const res = await testClient.request('/health', {
      headers: {
        'Origin': 'http://localhost:3000',
      },
    });

    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});
