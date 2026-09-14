import express from "express";
import {
    flashSalePurchase,
    purchaseProduct,
} from "../controllers/purchase.controller";
import { authUser } from "../middlewares/auth.middleware";
import { purchaseRateLimiter } from "../middlewares/ratelimiter.middleware";

const purchaseRouter = express.Router();

purchaseRouter.post(
    "/product/:productId",
    authUser,
    purchaseRateLimiter,
    purchaseProduct,
);
purchaseRouter.post(
    "/salePurchase/:id",
    authUser,
    purchaseRateLimiter,
    flashSalePurchase,
);

export default purchaseRouter;
