// product.model.ts
import mongoose, { Schema, Document } from "mongoose";

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
    adminId?: string;
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
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model<product>("Product", productSchema);

export default Product;
