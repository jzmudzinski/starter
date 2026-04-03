#!/usr/bin/env tsx
/**
 * Setup script — pushes Drizzle schema to the database.
 * Run: npx tsx scripts/setup.ts
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const envFile = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(envFile)) {
  console.error("❌ .env.local not found. Copy .env.example and fill in the values.");
  process.exit(1);
}

const env = fs.readFileSync(envFile, "utf-8");
if (!env.includes("DATABASE_URL=") || env.includes("DATABASE_URL=your_")) {
  console.error("❌ DATABASE_URL is not set in .env.local");
  process.exit(1);
}

console.log("🚀 Pushing schema to database…");
try {
  execSync("npx drizzle-kit push", { stdio: "inherit" });
  console.log("✅ Schema pushed successfully!");
  console.log("\nNext steps:");
  console.log("  npm run dev");
  console.log("  Open http://localhost:3000");
} catch (err) {
  console.error("❌ Schema push failed:", err);
  process.exit(1);
}
