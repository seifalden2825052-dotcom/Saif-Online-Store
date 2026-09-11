import {
  createSession,
  query,
  readJson,
  sendJson,
  sendMethodNotAllowed,
  sendServerError,
  setSessionCookie,
  verifyPassword,
} from "../_admin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res);
  }

  try {
    const body = await readJson(req);
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password || password.length > 200) {
      return sendJson(res, 400, { error: "Email and password are required." });
    }

    const result = await query(
      `SELECT id, email, role, password_hash
       FROM admin_users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );
    const user = result.rows[0];

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return sendJson(res, 401, { error: "Invalid demo credentials." });
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);

    return sendJson(res, 200, {
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
}