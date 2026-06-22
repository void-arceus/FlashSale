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
            description,
            quantity,
            originalPrice,
            salePrice,
            category,
            saleStartTime,
            saleEndTime,
        } = req.body || "";
        const result = validateProductInfo(
            productName,
            description,
            Number(quantity),
            Number(originalPrice),
            Number(salePrice),
            category,
            new Date(saleStartTime),
            new Date(saleEndTime),
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
