import {
  clearSessionCookie,
  deleteSession,
  sendJson,
  sendMethodNotAllowed,
  sendServerError,
} from "../_admin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendMethodNotAllowed(res);
  }

  try {
    await deleteSession(req);
    clearSessionCookie(res);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendServerError(res, error);
  }
}