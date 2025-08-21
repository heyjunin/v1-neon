import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { JwtService } from '../lib/jwt';
import type { JwtPayload } from '../types/auth';

export interface AuthContext {
  Variables: {
    user: JwtPayload;
  };
}

export const authMiddleware = createMiddleware<AuthContext>(async (c, next) => {
  const authHeader = c.req.header('Authorization') || null;
  const token = JwtService.extractTokenFromHeader(authHeader);

  if (!token) {
    throw new HTTPException(401, { message: 'Authorization header required' });
  }

  try {
    const payload = await JwtService.verify(token);
    c.set('user', payload);
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' });
  }
});
