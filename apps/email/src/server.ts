import { Hono } from "hono";
import { setupMiddleware } from "./middleware";
import routes from "./routes";

const app = new Hono();

// Configurar middleware
setupMiddleware(app);

// Montar rotas
app.route("/", routes);

// Middleware de erro
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    { error: "Internal server error" },
    500
  );
});

// Middleware 404
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
