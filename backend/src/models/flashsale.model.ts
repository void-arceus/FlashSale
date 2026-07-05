import mongoose, { Schema } from "mongoose";
import type { product } from "./product.model";

interface FlashSale {
    productId: mongoose.Types.ObjectId | product;
    adminId: mongoose.Types.ObjectId;
    salePrice: number;
    saleStartTime: Date;
    saleEndTime: Date;
}

const flashSchema = new Schema<FlashSale>(
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
    },
    { timestamps: true },
);

const FlashSale = mongoose.model<FlashSale>("flashSale", flashSchema);

export default FlashSale;
