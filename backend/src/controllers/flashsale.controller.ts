// flashsale.controller.ts

import { Request, Response } from "express";
import type { IFlashSale } from "../models/flashsale.model";
import Product from "../models/product.model";
import FlashSale from "../models/flashsale.model";

export const ScheduleFlashSale = async (req: Request, res: Response) => {
    try {
        const data: IFlashSale = req.body.data;
        // validate product Id
        const product = await Product.findById(data?.productId);
        if (!product) {
            return res.status(400).json({
                status: false,
                message: "Invalid product ID",
            });
        }

        // checking if product is already on sale
        const checkSale = await FlashSale.findOne({
            productId: data.productId,
        });
        if (checkSale) {
            return res.status(400).json({
                status: false,
                message: "Product is already on sale",
            });
        }

        const sale = await FlashSale.create(data);
        return res
            .status(200)
            .json({ status: true, message: "Sale Scheduled Successfully!" });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!",
        });
    }
};
