// This is a wrapper for the vite.ts module that uses our patched vite.config
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.patched.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ["all"], // Using "all" or string[] instead of boolean
  };

  const vite = await createViteServer({
    ...viteConfig,
    server: serverOptions,
  });

  app.use(vite.middlewares);

  log("Vite dev server started", "vite");
}

export function serveStatic(app: Express) {
  const staticFilesPath = path.resolve("./dist/public");
  const indexPath = path.join(staticFilesPath, "index.html");

  if (fs.existsSync(staticFilesPath)) {
    app.use(express.static(staticFilesPath));

    app.get("*", (req, res) => {
      const html = fs.readFileSync(indexPath, "utf-8");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });

    log("Static files are being served", "vite");
  } else {
    log("No static files found to serve", "vite");
  }
}