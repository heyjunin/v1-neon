import { describe, it, expect } from 'vitest';
import { testClient } from './helpers';

describe('Basic API Tests', () => {
  it('should return root endpoint', async () => {
    const res = await testClient.request('/');
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toMatchObject({
      message: 'V1 Engine API',
      version: '1.0.0',
    });
  });

  it('should return 404 for unknown routes', async () => {
    const res = await testClient.request('/unknown-route');
    expect(res.status).toBe(404);
  });
});
