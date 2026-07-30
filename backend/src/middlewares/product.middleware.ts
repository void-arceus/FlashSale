// product.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validateProductInfo } from "../validators/product.validator";

export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {
            productName,
            productDescription,
            productQuantity,
            productOriginalPrice,
            productCategory,
        } = req.body || "";
        const result = validateProductInfo(
            productName,
            productDescription,
            Number(productQuantity),
            Number(productOriginalPrice),
            productCategory,
        );
        if (result.status === false) {
            return res
                .status(400)
                .json({ status: false, message: result.message });
        }
        return next();
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};
