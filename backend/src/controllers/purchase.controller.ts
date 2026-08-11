// purchase.controller.ts
import { Request, Response } from "express";
import Product from "../models/product.model";
import Order from "../models/order.model";
import mongoose from "mongoose";

export const purchaseProduct = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { productId } = req.params;
        const { purchaseQuantity } = req.body;
        const product = await Product.findById(productId).session(session);
        if (!product) {
            await session.abortTransaction();
            return res.status(404).json({
                status: false,
                message: "Invalid Product Id",
            });
        }

        if (product.productQuantity < purchaseQuantity) {
            await session.abortTransaction();
            return res.status(409).json({
                status: false,
                message: "Out of Stock",
            });
        }

        // reserve inventory
        await Product.findByIdAndUpdate(
            { _id: productId },
            {
                productQuantity: product.productQuantity - purchaseQuantity,
            },
            { session },
        );

        // create order
        const order = new Order({
            productId: product._id,
            adminId: product.adminId,
            userId: req?.user?.id,
            orderQuantity: purchaseQuantity,
            orderPrice: product.productOriginalPrice,
        });

        await order.save({ session });
        await session.commitTransaction();

        return res.status(201).json({
            status: true,
            message: "Ordered placed successfully",
            orderId: order._id,
            orderStatus: order.orderStatus,
        });
    } catch (error: any) {
        await session.abortTransaction();
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    } finally {
        await session.endSession();
    }
};
