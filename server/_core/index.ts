import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("[DB] No DATABASE_URL set, skipping migrations");
    return;
  }
  try {
    const { migrate } = await import("drizzle-orm/mysql2/migrator");
    const { drizzle } = await import("drizzle-orm/mysql2");
    const mysql = await import("mysql2/promise");
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);
    console.log("[DB] Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("[DB] Migrations complete");
    await connection.end();
  } catch (err) {
    console.error("[DB] Migration error:", err);
  }
}

async function seedAdminIfNeeded() {
  if (!process.env.DATABASE_URL) return;
  try {
    const mysql = await import("mysql2/promise");
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS adminCredentials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(64) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()
      )
    `);
    const [rows] = await conn.execute("SELECT id FROM adminCredentials LIMIT 1");
    const arr = rows as Array<{ id: number }>;
    if (arr.length === 0) {
      const crypto = await import("crypto");
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2("Tahmid1234!", salt, 100000, 64, "sha512", (err, key) => {
          if (err) reject(err);
          else resolve(key.toString("hex"));
        });
      });
      await conn.execute(
        "INSERT INTO adminCredentials (username, passwordHash) VALUES (?, ?)",
        ["mustyadmin", `${salt}:${hash}`]
      );
      console.log("[DB] Admin credentials seeded: mustyadmin / Tahmid1234!");
    }
    await conn.end();
  } catch (err) {
    console.error("[DB] Admin seed error:", err);
  }
}

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

async function startServer() {
  await runMigrations();
  await seedAdminIfNeeded();

  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
