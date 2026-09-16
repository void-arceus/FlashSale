// purchase.controller.ts
import { Request, Response } from "express";
import Product from "../models/product.model";
import FlashSale from "../models/flashsale.model";
import Order from "../models/order.model";
import mongoose from "mongoose";
import {
    addRequestToWorker,
    clearSaleWorker,
    resolveRequest,
} from "../workers/flashSaleWorker";

export const handlePurchaseProduct = async (
    sale_id: string,
    user_id: string,
) => {
    const session = await mongoose.startSession();
    try {
        const saleId = new mongoose.Types.ObjectId(sale_id);
        const userId = new mongoose.Types.ObjectId(user_id);

        session.startTransaction();

        // prevent user from buying again from same sale
        const check = await Order.findOne({
            userId,
            saleId,
        });
        if (check) {
            await session.abortTransaction();
            return {
                statusCode: 409,
                status: false,
                message: "You can only purchase once during sale!",
            };
        }

        const purchase = await FlashSale.findOneAndUpdate(
            {
                _id: saleId,
                flashSaleQuantity: { $gte: 1 },
            },
            {
                $inc: { flashSaleQuantity: -1 },
            },
            { session, returnDocument: "after" },
        );
        if (!purchase) {
            await session.abortTransaction();
            clearSaleWorker();
            return {
                statusCode: 409,
                status: false,
                message: "OUT OF STOCK!",
            };
        }

        const order = new Order({
            productId: purchase?.productId,
            adminId: purchase?.adminId,
            userId: userId,
            saleId: saleId,
            orderQuantity: 1,
            orderPrice: purchase?.flashSalePrice,
            orderStatus: "COMPLETED",
            orderType: "FLASHSALE",
        });

        await order.save({ session });
        await session.commitTransaction();
        return {
            statusCode: 200,
            status: true,
            message: "Product Bought Successfully!",
            orderId: order._id,
        };
    } catch (error: any) {
        // if transient transaction error put that request into the worker queue
        if (error?.errorLabelSet?.has("TransientTransactionError")) {
            // put this request in worker queue
            return {
                statusCode: 400,
                status: false,
                message: "TransientTransactionError",
            };
        }
    } finally {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
    }
};

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
            )
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
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const result = await handlePurchaseProduct(
            id as string,
            userId as string,
        );
        console.log("Result:", result);
        if (result?.statusCode === 400) {
            addRequestToWorker({
                userId: userId as string,
                saleId: id as string,
                res: res,
            });
            resolveRequest();
            return;
        }
        return res.status(Number(result?.statusCode)).json({
            status: result?.status,
            message: result?.message,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};
