import { describe, expect, it } from 'vitest';
import { testClient } from './helpers';

describe('Routes Registration', () => {
  it('should have root endpoint', async () => {
    const res = await testClient.request('/');
    expect(res.status).toBe(200);
  });

  it('should have health endpoint', async () => {
    const res = await testClient.request('/health');
    console.log('Health endpoint status:', res.status);
    console.log('Health endpoint headers:', Object.fromEntries(res.headers.entries()));
    
    if (res.status !== 200) {
      const text = await res.text();
      console.log('Health endpoint response:', text);
    }
    
    expect(res.status).toBe(200);
  });

  it('should have auth endpoint', async () => {
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
    
    console.log('Auth endpoint status:', res.status);
    expect(res.status).toBe(200);
  });

  it('should have protected endpoint', async () => {
    const res = await testClient.request('/protected/profile');
    console.log('Protected endpoint status:', res.status);
    expect(res.status).toBe(401); // Should require auth
  });
});
