import express from "express";
import { purchaseProduct } from "../controllers/purchase.controller";
import { authUser } from "../middlewares/auth.middleware";

const purchaseRouter = express.Router();

purchaseRouter.post(
    "/product/:productId/:purchaseQuantity",
    authUser,
    purchaseProduct,
);
// purchaseRouter.post("/product/flashsale/:saleId");

export default purchaseRouter;
