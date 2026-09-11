import {
  getSessionUser,
  query,
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
    if (!user) return sendJson(res, 401, { error: "Authentication required." });

    await query("SELECT 1");

    return sendJson(res, 200, {
      cards: [
        { label: "Catalog", value: "6 curated products", tone: "copper" },
        { label: "Checkout", value: "Demo mode", tone: "muted" },
        {
          label: "Database",
          value: "Connected",
          tone: "green",
        },
      ],
      note: "This portfolio dashboard is a controlled demo. No real payments, shipping, or customer data are processed.",
    });
  } catch (error) {
    return sendServerError(res, error);
  }
}