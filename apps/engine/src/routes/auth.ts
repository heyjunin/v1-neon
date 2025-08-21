import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { JwtService } from '../lib/jwt';

const app = new OpenAPIHono();

// Mock user for demo purposes
const MOCK_USER = {
  id: '1',
  email: 'admin@example.com',
  password: 'password123',
  name: 'Admin User',
};

const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
            },
            required: ['email', 'password'],
          },
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              token_type: { type: 'string', enum: ['Bearer'] },
              expires_in: { type: 'number' },
            },
            required: ['access_token', 'token_type', 'expires_in'],
          },
        },
      },
      description: 'Login successful',
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
      description: 'Invalid credentials',
    },
  },
  tags: ['Auth'],
  summary: 'User login',
  description: 'Authenticate user and return JWT token',
});

app.openapi(loginRoute, async (c: any) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400);
    }

    if (!email.includes('@')) {
      return c.json({ message: 'Invalid email format' }, 400);
    }

    // Mock authentication
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const token = await JwtService.sign({
      sub: MOCK_USER.id,
      email: MOCK_USER.email,
      name: MOCK_USER.name,
    });

    return c.json({
      access_token: token,
      token_type: 'Bearer' as const,
      expires_in: 86400, // 24 hours
    });
  } catch (error) {
    return c.json({ message: 'Invalid request body' }, 400);
  }
});

export { app as authRoutes };
