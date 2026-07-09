// flashsale.route.ts

import express, { Router } from "express";
import { authAdmin } from "../middlewares/auth.middleware";
import {
    deleteSale,
    getAdminSales,
    getAllSales,
    ScheduleFlashSale,
    updateSale,
} from "../controllers/flashsale.controller";
import { validateFlashSaleData } from "../middlewares/validate.middleware";

const saleRouter: Router = express.Router();

saleRouter.post(
    "/flashsale",
    authAdmin,
    validateFlashSaleData,
    ScheduleFlashSale,
);

saleRouter.get("/sales", getAllSales);
saleRouter.get("/mysales/:id", authAdmin, getAdminSales);
saleRouter.delete("/delete/:id", authAdmin, deleteSale);
saleRouter.patch("/update/:id", authAdmin, updateSale);

export default saleRouter;
