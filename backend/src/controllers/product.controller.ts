// product.controller.ts
import { Request, Response } from "express";
import { uploadImage } from "../utils/imagekit.util";
import Product from "../models/product.model";

export const addProduct = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ status: false, message: "No Image Uploaded" });
        }
        const fileBuffer = req.file.buffer;
        const name = req.file.originalname;
        const uploadFile = await uploadImage(fileBuffer, name);
        const url = uploadFile.url;

        // take the product info inputs
        const {
            productName,
            description,
            quantity,
            originalPrice,
            salePrice,
            category,
            saleStartTime,
            saleEndTime,
        } = req.body;

        const result = await Product.create({
            productName,
            url,
            description,
            quantity: Number(quantity),
            originalPrice: Number(originalPrice),
            salePrice: Number(salePrice),
            category,
            saleStartTime: new Date(saleStartTime),
            saleEndTime: new Date(saleEndTime),
        });

        return res
            .status(201)
            .json({ status: true, message: "Image Uploaded Successfully" });
    } catch (error: any) {
        console.error(error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};
