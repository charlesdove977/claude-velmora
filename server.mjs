// Production server: Express + gzip/brotli-friendly compression in front of the
// Astro node adapter (middleware mode). Static pages and assets are served from
// dist/client with long cache headers; /api/* routes go through the SSR handler.
// Run with: node server.mjs  (PORT and HOST from the environment)
import express from "express";
import compression from "compression";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { existsSync } from "node:fs";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(compression({ threshold: 512 }));
// Prerendered pages live at <route>/index.html. Serve them for clean URLs.
const client = join(here, "dist/client");
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api/") || extname(req.path)) return next();
  const clean = req.path.replace(/\/+$/, "") || "";
  const file = join(client, clean, "index.html");
  if (file.startsWith(client) && existsSync(file)) return res.sendFile(file, { maxAge: "1h" });
  next();
});
app.use("/_astro", express.static(join(here, "dist/client/_astro"), { maxAge: "1y", immutable: true }));
app.use(express.static(client, { maxAge: "1h", redirect: false }));
app.use(ssrHandler);
app.use((req, res) => {
  res.status(404).sendFile(join(here, "dist/client/404.html"));
});

const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => console.log(`velmora listening on http://${host}:${port}`));
