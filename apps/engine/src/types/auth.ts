import { z } from 'zod';

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
