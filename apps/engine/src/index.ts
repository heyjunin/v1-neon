import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authRoutes } from './routes/auth';
import { healthRoutes } from './routes/health';
import { protectedRoutes } from './routes/protected';

const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());

// OpenAPI configuration
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'V1 Engine API',
    version: '1.0.0',
    description: 'A simple API built with Hono, JWT, and OpenAPI',
  },
  servers: [
    {
      url: 'http://localhost:3004',
      description: 'Development server',
    },
  ],
});

// Routes
app.route('/auth', authRoutes);
app.route('/', healthRoutes);
app.route('/protected', protectedRoutes);

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/docs' }));

// Root endpoint
app.get('/', (c: any) => {
  return c.json({
    message: 'V1 Engine API',
    version: '1.0.0',
    docs: '/docs',
    swagger: '/swagger',
  });
});

// 404 handler
app.notFound((c: any) => {
  return c.json({ message: 'Not Found' }, 404);
});

// Error handler
app.onError((err: any, c: any) => {
  console.error('Error:', err);
  return c.json({ message: 'Internal Server Error' }, 500);
});

const port = parseInt(process.env.PORT || '3004');

console.log(`🚀 Server is running on http://localhost:${port}`);
console.log(`📚 API Documentation: http://localhost:${port}/docs`);
console.log(`🔍 Swagger UI: http://localhost:${port}/swagger`);

export { app };

export default {
  port,
  fetch: app.fetch,
};
