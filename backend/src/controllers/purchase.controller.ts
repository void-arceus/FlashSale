// purchase.controller.ts
import { Request, Response } from "express";
import Product from "../models/product.model";
import FlashSale from "../models/flashsale.model";
import Order from "../models/order.model";
import mongoose from "mongoose";

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
                orderStatus: "COMPLETED",
                orderType: "NORMAL",
            });

            await order.save({ session });

            await session.commitTransaction();

            return res.status(201).json({
                status: true,
                message: "Order placed successfully",
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

export const flashSalePurchase = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { id } = req.params;
        const userId = req.user?.id;

        // prevent user from buying again from same sale
        const check = await Order.findOne({ userId, productId: id });
        if (check) {
            return res.status(409).json({
                status: false,
                message: "You can only purchase once during sale!",
            });
        }

        const saleProduct = await FlashSale.findOneAndUpdate(
            {
                _id: id,
                flashSaleQuantity: { $gte: 1 },
            },
            {
                $inc: { flashSaleQuantity: -1 },
            },
            { session, returnDocument: "after" },
        );

        if (!saleProduct) {
            await session.abortTransaction();
            return res.status(409).json({
                status: false,
                message: "Product not found or OUT of Stock",
            });
        }

        const order = new Order({
            productId: saleProduct?.productId,
            adminId: saleProduct?.adminId,
            userId: userId,
            orderQuantity: 1,
            orderPrice: saleProduct?.flashSalePrice,
            orderStatus: "COMPLETED",
            orderType: "FLASHSALE",
        });

        await order.save({ session });
        await session.commitTransaction();
        return res.status(200).json({
            status: true,
            message: "Product Bought Successfully!",
            orderId: order._id,
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
