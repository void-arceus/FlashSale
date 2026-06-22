// product.route.ts
import express, { Router } from "express";
import multer from "multer";
import { authAdmin } from "../middlewares/auth.middleware";
import { addProduct } from "../controllers/product.controller";

const productRouter: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

productRouter.post(
    "/addProduct",
    authAdmin,
    upload.single("image"),
    addProduct,
);

export default productRouter;
