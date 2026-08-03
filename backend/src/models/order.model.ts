import mongoose, { Schema } from "mongoose";
import { timeStamp } from "node:console";

export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IOrder {
    productId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    orderQuantity: number;
    orderPrice: number;
    orderStatus: OrderStatus;
}

const orderSchema = new Schema<IOrder>(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        adminId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderQuantity: {
            type: Number,
            required: true,
        },
        orderPrice: { type: Number, required: true },
        orderStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
            required: true,
        },
    },
    { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
