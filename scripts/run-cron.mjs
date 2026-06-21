#!/usr/bin/env node
/**
 * Ejecuta el cron localmente contra el dev server.
 * Uso: npm run dev (en otra terminal) + npm run cron:local
 *
 * Carga .env.local automáticamente (Next.js no lo hace en scripts sueltos).
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const cronSecret = process.env.CRON_SECRET;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

if (!cronSecret) {
  console.error(
    "Falta CRON_SECRET. Agregalo en .env.local:\n  CRON_SECRET=tu-valor-generado"
  );
  process.exit(1);
}

const url = `${baseUrl}/api/cron/process`;

console.log(`→ GET ${url}`);

fetch(url, {
  headers: { Authorization: `Bearer ${cronSecret}` },
})
  .then(async (res) => {
    const body = await res.json();
    console.log(JSON.stringify(body, null, 2));
    if (!res.ok) process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
