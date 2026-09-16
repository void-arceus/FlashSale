import { type Router } from "express";
import express from "express";
import { getUserOrders } from "../controllers/orders.controller";
import { authUser } from "../middlewares/auth.middleware";

const orderRouter: Router = express.Router();

orderRouter.get("/:id", authUser, getUserOrders); // get user orders

export default orderRouter;
