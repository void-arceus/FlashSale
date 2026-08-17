import express from "express";
import { purchaseProduct } from "../controllers/purchase.controller";
import { authUser } from "../middlewares/auth.middleware";
import { purchaseRateLimiter } from "../middlewares/ratelimiter.middleware";

const purchaseRouter = express.Router();

purchaseRouter.post(
    "/product/:productId",
    authUser,
    purchaseRateLimiter,
    purchaseProduct,
);
// purchaseRouter.post("/product/flashsale/:saleId");

export default purchaseRouter;
