// product.controller.ts
import { Request, Response } from "express";
import { uploadImage } from "../utils/imagekit.util";

export const addProduct = async (req: Request, res: Response) => {
    try {
        // upload file from here
        if (!req.file) {
            return res
                .status(400)
                .json({ status: false, message: "No Image Uploaded" });
        }
        const fileBuffer = req.file.buffer;
        const name = req.file.originalname;
        const uploadFile = await uploadImage(fileBuffer, name);
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
