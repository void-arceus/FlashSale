import mongoose from "mongoose";
import { type Request, type Response } from "express";
import Order from "../models/order.model";

export async function getUserOrders(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "ID not provided!",
            });
        }

        const orders = await Order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id as string),
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $unwind: "$productDetail",
            },
        ]);
        let len = orders.length;
        return res.status(len === 0 ? 204 : 200).json({
            status: true,
            message:
                len === 0 ? "No orders found!" : "Orders fetched successfully",
            data: {
                orders: orders,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}
