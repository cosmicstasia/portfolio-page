#!/usr/bin/env bun
/**
 * Minimal static file server for the built `dist/` output, using Bun's
 * native Bun.serve + Bun.file (no Express/serve-handler dependency).
 * Used for local preview instead of `astro preview`, per project preference
 * for Bun-native APIs where practical.
 */
import { join, extname } from "node:path";

const DIST = join(import.meta.dir, "..", "dist");
const PORT = Number(process.env.PORT) || 4321;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.endsWith("/")) pathname += "index.html";
    if (!extname(pathname)) pathname += "/index.html";

    let file = Bun.file(join(DIST, pathname));
    if (!(await file.exists())) {
      file = Bun.file(join(DIST, "404.html"));
      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(file, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    const type = MIME[extname(pathname)] ?? "application/octet-stream";
    return new Response(file, { headers: { "content-type": type } });
  },
});

console.log(`static preview server on http://localhost:${PORT}`);
