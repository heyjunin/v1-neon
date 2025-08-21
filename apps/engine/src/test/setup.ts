import { afterAll, beforeAll } from 'vitest';

// Setup global test environment
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
});

afterAll(() => {
  // Cleanup
});
