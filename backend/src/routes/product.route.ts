// product.route.ts
import express, { Router } from "express";
import multer from "multer";
import { authAdmin } from "../middlewares/auth.middleware";
import {
    addProduct,
    deleteProduct,
    getProducts,
} from "../controllers/product.controller";
import { validateProduct } from "../middlewares/product.middleware";

const productRouter: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

productRouter.post(
    "/add",
    authAdmin,
    upload.single("image"),
    validateProduct,
    addProduct,
);
productRouter.get("/products", getProducts);
productRouter.post("/delete/:id", authAdmin, deleteProduct);

export default productRouter;
