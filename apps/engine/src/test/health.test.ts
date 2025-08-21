import { describe, expect, it } from 'vitest';
import { expectJsonResponse, testClient } from './helpers';

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await testClient.request('/health');
    expectJsonResponse(res);

    const data = await res.json();
    expect(data).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
      version: expect.any(String),
    });

    // Validate timestamp format
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('should return 200 status code', async () => {
    const res = await testClient.request('/health');
    expect(res.status).toBe(200);
  });

  it('should have correct content type', async () => {
    const res = await testClient.request('/health');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
