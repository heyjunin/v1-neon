import type { Context } from "hono";
import { validateConfig } from "../config";

export const healthHandler = (c: Context) => {
  try {
    validateConfig();
    
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "email-service",
    });
  } catch (error) {
    return c.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Configuration error",
      },
      500
    );
  }
};
