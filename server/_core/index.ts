import { fileURLToPath } from "url";
import path from "path";
// Load .env from the project root regardless of working directory
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");
dotenv.config({ path: path.join(projectRoot, ".env") });

import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

import { registerRestApiRoutes } from "../routes";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerRestApiRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  server.listen(port, "0.0.0.0", () => {
    console.log(`\n🛡️  Suraksha Link — Server running on http://localhost:${port}/`);
    console.log(`📦  ENV loaded from: ${path.join(projectRoot, ".env")}`);
    console.log(`🔑  API Key Status:`);
    console.log(`     Gemini AI   : ${process.env.GEMINI_API_KEY ? "✅ Configured" : "⚠️  Not set (using deterministic fallback)"}`);
    console.log(`     OpenRouter  : ${process.env.OPENROUTER_API_KEY ? "✅ Configured" : "⚠️  Not set"}`);
    console.log(`     Resend      : ${process.env.RESEND_API_KEY ? "✅ Configured — real emails will be dispatched" : "⚠️  Not set (alerts logged locally)"}`);
    console.log(`     Google Maps : ${process.env.GOOGLE_MAPS_API_KEY ? "✅ Configured" : "⚠️  Not set (using built-in GIS engine)"}\n`);
  });
}

startServer().catch(console.error);
