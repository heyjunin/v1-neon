import { SignJWT, jwtVerify } from 'jose';
import { JwtPayload, JwtPayloadSchema } from '../types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const JWT_ALGORITHM = 'HS256';

export class JwtService {
  static async sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return jwt;
  }

  static async verify(token: string): Promise<JwtPayload> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
      });

      return JwtPayloadSchema.parse(payload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }
}
