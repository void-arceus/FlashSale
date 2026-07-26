// product.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    productName: string;
    productImageUrl: string;
    productDescription: string;
    productQuantity: number;
    productOriginalPrice: number;
    productCategory: string;
    createdAt: Date;
    updatedAt: Date;
    adminId: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
    {
        productName: { type: String, required: true, trim: true },
        productImageUrl: { type: String, required: true, trim: true },
        productDescription: { type: String, required: true, trim: true },
        productQuantity: { type: Number, required: true },
        productOriginalPrice: { type: Number, required: true },
        productCategory: { type: String, required: true, trim: true },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
