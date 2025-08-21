import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const app = new OpenAPIHono();

const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string(),
});

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              timestamp: { type: 'string', format: 'date-time' },
              uptime: { type: 'number' },
              version: { type: 'string' },
            },
            required: ['status', 'timestamp', 'uptime', 'version'],
          },
        },
      },
      description: 'Health check successful',
    },
  },
  tags: ['Health'],
  summary: 'Health check',
  description: 'Check if the API is running',
});

app.openapi(healthRoute, (c: any) => {
  const healthData = {
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  };

  return c.json(healthData);
});

export { app as healthRoutes };
