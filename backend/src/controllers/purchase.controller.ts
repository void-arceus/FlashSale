// purchase.controller.ts
import { Request, Response } from "express";
import Product from "../models/product.model";

export const purchaseProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { purchaseQuantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Invalid Product Id",
            });
        }

        if (product.productQuantity < purchaseQuantity) {
            return res.status(409).json({
                status: false,
                message: "Out of Stock",
            });
        }

        // reserver inventory
        await Product.findByIdAndUpdate(
            { _id: productId },
            {
                productQuantity: product.productQuantity - purchaseQuantity,
            },
        );

        return res.status(201).json({
            status: true,
            message: "Ordered placed successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};
