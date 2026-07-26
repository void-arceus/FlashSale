import mongoose, { Schema } from "mongoose";
import type { IProduct } from "./product.model";

export interface IFlashSale {
    productId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    flashSalePrice: number;
    flashSaleStartTime: Date;
    flashSaleEndTime: Date;
    flashSaleQuantity: number;
    productDetail?: IProduct;
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
        flashSalePrice: {
            type: Number,
            required: true,
        },
        flashSaleStartTime: {
            type: Date,
            required: true,
        },
        flashSaleEndTime: {
            type: Date,
            required: true,
        },
        flashSaleQuantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const FlashSale = mongoose.model<IFlashSale>("flashSale", flashSchema);

export default FlashSale;
