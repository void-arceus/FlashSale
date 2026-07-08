// flashsale.controller.ts
import mongoose from "mongoose";
import { Request, Response } from "express";
import type { IFlashSale } from "../models/flashsale.model";
import type { product } from "../models/product.model";
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

        // if valid Productid get the productData
        const productDetail = (await Product.findById(
            data.productId,
        )) as product;
        data.productDetails = productDetail;

        const sale = await FlashSale.create(data);
        return res.status(200).json({
            status: true,
            message: "Sale Scheduled Successfully!",
            data: data,
        });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!",
        });
    }
};

export const getAllSales = async (req: Request, res: Response) => {
    try {
        const sales = await FlashSale.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
        ]);
        return res.status(200).json({
            status: true,
            message: "Sales fetched successfully",
            data: sales,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const getAdminSales = async (req: Request, res: Response) => {
    try {
        const { id } = req.params || null;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Admin Id not provided",
            });
        }
        // get admin products
        const products = await FlashSale.aggregate([
            {
                $match: {
                    adminId: new mongoose.Types.ObjectId(id as string),
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $unwind: "$productDetail",
            },
        ]);

        console.log("Products:", products);

        return res.status(200).json({
            status: true,
            message: "Sales fetched successfully",
            data: products,
        });
    } catch (error: any) {
        return res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
    }
};

export const updateSale = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || null;
        const { data } = req.body;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Sale id not provided",
            });
        }
        const updatedData = await FlashSale.findByIdAndUpdate(
            { _id: id },
            { data },
        );
        return res.status(200).json({
            status: true,
            message: "Sale updated successfully",
            data: updatedData,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteSale = async (req: Request, res: Response) => {
    try {
        const saleId = req.params.id || null;
        if (!saleId) {
            return res.status(400).json({
                status: false,
                message: "Sale Id not provided",
            });
        }
        await FlashSale.findByIdAndDelete(saleId);
        return res.status(200).json({
            status: true,
            message: "Sale deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};
