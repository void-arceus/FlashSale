// flashsale.route.ts

import express, { Router } from "express";
import { authAdmin } from "../middlewares/auth.middleware";
import { ScheduleFlashSale } from "../controllers/flashsale.controller";

const saleRouter: Router = express.Router();

saleRouter.post("/flashsale", authAdmin, ScheduleFlashSale);

export default saleRouter;
