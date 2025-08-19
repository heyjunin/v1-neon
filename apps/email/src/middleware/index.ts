import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const setupMiddleware = (app: any) => {
  app.use("*", logger());
  app.use("*", cors());
};
