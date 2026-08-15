import { defineConfig } from "drizzle-kit";

// Generates plain SQL into ./drizzle, which wrangler applies to D1
// (`npm run db:migrate:local` / `npm run db:migrate`).
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
