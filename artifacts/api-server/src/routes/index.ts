import { Router, type IRouter } from "express";
import coupleRouter from "./couple";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coupleRouter);

export default router;
