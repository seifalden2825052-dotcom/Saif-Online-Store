import { Router, type IRouter } from "express";
import healthRouter from "./health";
// @ts-expect-error The Vercel handlers are shared with the local API preview.
import loginHandler from "../../../../api/admin/login.js";
// @ts-expect-error The Vercel handlers are shared with the local API preview.
import meHandler from "../../../../api/admin/me.js";
// @ts-expect-error The Vercel handlers are shared with the local API preview.
import logoutHandler from "../../../../api/admin/logout.js";
// @ts-expect-error The Vercel handlers are shared with the local API preview.
import summaryHandler from "../../../../api/admin/summary.js";

const router: IRouter = Router();

router.use(healthRouter);
router.post("/admin/login", loginHandler);
router.get("/admin/me", meHandler);
router.post("/admin/logout", logoutHandler);
router.get("/admin/summary", summaryHandler);

export default router;
