import { config, validateConfig } from "./config";
import app from "./server";

console.log(`🚀 Email Service starting on port ${config.port}`);

// Validar configuração na inicialização
validateConfig();

export default {
  port: config.port,
  fetch: app.fetch,
};
