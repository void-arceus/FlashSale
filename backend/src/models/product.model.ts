// product.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { timeStamp } from "node:console";

interface product extends Document {
    productName: string;
    url: string;
    description: string;
    quantity: number;
    originalPrice: number;
    salePrice: number;
    category: string;
    saleStartTime: Date;
    saleEndTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<product>(
    {
        productName: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        category: { type: String, required: true, trim: true },
        saleStartTime: { type: Date },
        saleEndTime: { type: Date },
    },
    { timestamps: true },
);

const Product = mongoose.model<product>("Product", productSchema);

export default Product;
