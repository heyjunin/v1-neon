import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// Carregar variáveis de ambiente apenas no servidor
if (typeof process !== "undefined" && process.stdout) {
  config();
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql as any);
