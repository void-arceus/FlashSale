import mongoose, { Schema } from "mongoose";
import type { product } from "./product.model";

export interface IFlashSale {
    productId: mongoose.Types.ObjectId | product;
    adminId: mongoose.Types.ObjectId;
    originalPrice: number;
    salePrice: number;
    saleStartTime: Date;
    saleEndTime: Date;
    saleQuantity: number;
    productDetail?: product;
}

const flashSchema = new Schema<IFlashSale>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        salePrice: {
            type: Number,
            required: true,
        },
        saleStartTime: {
            type: Date,
            required: true,
        },
        saleEndTime: {
            type: Date,
            required: true,
        },
        saleQuantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const FlashSale = mongoose.model<IFlashSale>("flashSale", flashSchema);

export default FlashSale;
