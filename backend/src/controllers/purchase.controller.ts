// purchase.controller.ts
import { Request, Response } from "express";
import Product from "../models/product.model";
import Order from "../models/order.model";
import mongoose from "mongoose";

function paymentSimulation() {
    // let max = 2;
    // return Math.floor(Math.random() * max);
    return 1;
}

export const purchaseProduct = async (req: Request, res: Response) => {
    const MAX_RETRIES = 3;

    const { productId } = req.params;
    const { purchaseQuantity } = req.body;
    const userId = req.user?.id;

    if (!Number.isInteger(purchaseQuantity) || purchaseQuantity <= 0) {
        return res.status(400).json({
            status: false,
            message: "Invalid Purchase Quantity",
        });
    }

    for (let attempt = 0; attempt < MAX_RETRIES; ++attempt) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const product = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    productQuantity: { $gte: purchaseQuantity },
                },
                { $inc: { productQuantity: -purchaseQuantity } },
                { session, returnDocument: "after" },
            );

            if (!product) {
                await session.abortTransaction();
                return res.status(409).json({
                    status: false,
                    message: "Product not found or Out of Stock",
                });
            }

            // create order
            const order = new Order({
                productId: product?._id,
                adminId: product?.adminId,
                userId,
                orderQuantity: purchaseQuantity,
                orderPrice: product?.productOriginalPrice,
            });

            // if payment fails
            if (paymentSimulation() === 0) {
                await session.abortTransaction();
                return res.status(402).json({
                    status: false,
                    message: "Payment Failed, Transaction rolled back",
                });
            }

            order.orderStatus = "COMPLETED";
            await order.save({ session });

            await session.commitTransaction();

            return res.status(201).json({
                status: true,
                message: "Ordered placed successfully",
                orderId: order._id,
                orderStatus: "COMPLETED",
            });
        } catch (error: any) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }

            // retry if transient transaction conflict
            if (
                error?.errorLabelSet?.has("TransientTransactionError") &&
                attempt < MAX_RETRIES - 1
            ) {
                console.log(
                    `Transaction conflict. Retrying attempt: ${attempt + 1}/${MAX_RETRIES}`,
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, 50 * (attempt + 1)),
                );
                continue;
            }

            console.error("PURCHASE_ERROR:", error);

            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } finally {
            await session.endSession();
        }
    }
};
