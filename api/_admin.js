import crypto from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const { Pool } = pg;
const scryptAsync = promisify(crypto.scrypt);
const SESSION_COOKIE = "auren_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const globalState = globalThis;

function getPool() {
  if (globalState.__aurenAdminPool) {
    return globalState.__aurenAdminPool;
  }

  const connectionString =
    process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("A database connection is not configured.");
  }

  globalState.__aurenAdminPool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  return globalState.__aurenAdminPool;
}

export function query(text, values = []) {
  return getPool().query(text, values);
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return {};
}

export function parseCookies(header = "") {
  return header.split(";").reduce((cookies, part) => {
    const separator = part.indexOf("=");
    if (separator === -1) return cookies;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

export function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
}

export async function hashPassword(password, salt = crypto.randomBytes(16)) {
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${Buffer.from(derivedKey).toString(
    "hex",
  )}`;
}

export async function verifyPassword(password, storedHash) {
  const [, saltHex, hashHex] = String(storedHash).split("$");
  if (!saltHex || !hashHex) return false;

  const derivedKey = await scryptAsync(
    password,
    Buffer.from(saltHex, "hex"),
    64,
  );
  const expected = Buffer.from(hashHex, "hex");
  const actual = Buffer.from(derivedKey);

  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);

  await query(
    `INSERT INTO admin_sessions (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
    [crypto.randomUUID(), userId, tokenHash],
  );

  return token;
}

export async function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const result = await query(
    `SELECT u.id, u.email, u.role, s.expires_at
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
}

export async function deleteSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return;

  await query("DELETE FROM admin_sessions WHERE token_hash = $1", [
    hashSessionToken(token),
  ]);
}

export function sendJson(res, status, body) {
  res.status(status).json(body);
}

export function sendMethodNotAllowed(res, methods = ["POST"]) {
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method not allowed" });
}

export function sendServerError(res, error) {
  console.error("AUREN admin API error", error);
  sendJson(res, 500, {
    error: "The admin service is temporarily unavailable.",
  });
}