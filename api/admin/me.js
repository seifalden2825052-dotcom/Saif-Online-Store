import {
  getSessionUser,
  sendJson,
  sendMethodNotAllowed,
  sendServerError,
} from "../_admin.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendMethodNotAllowed(res, ["GET"]);
  }

  try {
    const user = await getSessionUser(req);
    if (!user) return sendJson(res, 401, { authenticated: false });

    return sendJson(res, 200, {
      authenticated: true,
      user: {
        email: user.email,
        role: user.role,
        expiresAt: user.expires_at,
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
}