import crypto from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const { Pool } = pg;
const scryptAsync = promisify(crypto.scrypt);
const connectionString =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL is required.");
}

const pool = new Pool({ connectionString, max: 1 });
const password = "demo123";
const salt = crypto.randomBytes(16);
const derivedKey = await scryptAsync(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("hex")}$${Buffer.from(
  derivedKey,
).toString("hex")}`;

await pool.query(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS admin_sessions_token_hash_idx
    ON admin_sessions (token_hash);
`);

await pool.query(
  `INSERT INTO admin_users (id, email, password_hash, role)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (email)
   DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
  ["demo-admin", "demo@auren.com", passwordHash, "demo"],
);

await pool.end();
console.log("AUREN demo admin account is ready.");