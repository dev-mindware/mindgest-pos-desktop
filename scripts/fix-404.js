/**
 * fix-404.js
 * 
 * Next.js App Router outputs the "not found" page as `app/_not-found/index.html`
 * but electron-builder (via electron-serve) requires `app/404.html` to exist.
 * This script copies / creates the file so the packaging step doesn't fail.
 */

const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..", "app");
const notFoundSrc = path.join(appDir, "_not-found", "index.html");
const notFound404 = path.join(appDir, "404.html");

if (fs.existsSync(notFound404)) {
  console.log("[fix-404] app/404.html already exists – skipping.");
  process.exit(0);
}

if (fs.existsSync(notFoundSrc)) {
  fs.copyFileSync(notFoundSrc, notFound404);
  console.log("[fix-404] Copied _not-found/index.html → 404.html ✓");
} else {
  // Fallback: create a minimal 404.html so packaging never fails
  const fallback = `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>404 – Página não encontrada</title></head>
<body><h1>404 – Página não encontrada</h1></body>
</html>`;
  fs.writeFileSync(notFound404, fallback, "utf8");
  console.log("[fix-404] Created fallback app/404.html ✓");
}
