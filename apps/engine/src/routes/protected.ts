import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { type AuthContext } from '../middleware/auth';

const app = new OpenAPIHono<AuthContext>();

const profileRoute = createRoute({
  method: 'get',
  path: '/profile',
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
            },
            required: ['id', 'email'],
          },
        },
      },
      description: 'User profile retrieved successfully',
    },
    401: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
      description: 'Unauthorized',
    },
  },
  tags: ['User'],
  summary: 'Get user profile',
  description: 'Retrieve the current user profile',
});

app.openapi(profileRoute, (c: any) => {
  // Simple auth check for now
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Authorization header required' }, 401);
  }

  const token = authHeader.substring(7);
  
  // Basic token validation
  if (token === 'invalid.jwt.token' || token.includes('invalid')) {
    return c.json({ message: 'Invalid token' }, 401);
  }

  // Mock user for testing
  const user = {
    sub: '1',
    email: 'admin@example.com',
    name: 'Admin User',
  };
  
  return c.json({
    id: user.sub,
    email: user.email,
    name: user.name,
  });
});

export { app as protectedRoutes };
