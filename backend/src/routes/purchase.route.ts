import express from "express";
import { purchaseProduct } from "../controllers/purchase.controller";

const purchaseRouter = express.Router();

purchaseRouter.post("/product/:productId/:purchaseQuantity", purchaseProduct);
// purchaseRouter.post("/product/flashsale/:saleId");

export default purchaseRouter;
