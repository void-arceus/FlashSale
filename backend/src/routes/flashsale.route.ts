// flashsale.route.ts

import express, { Router } from "express";
import { authAdmin } from "../middlewares/auth.middleware";
import { ScheduleFlashSale } from "../controllers/flashsale.controller";
import { validateFlashSaleData } from "../middlewares/validate.middleware";

const saleRouter: Router = express.Router();

saleRouter.post(
    "/flashsale",
    authAdmin,
    validateFlashSaleData,
    ScheduleFlashSale,
);

export default saleRouter;
