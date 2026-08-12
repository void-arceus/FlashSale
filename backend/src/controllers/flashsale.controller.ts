// flashsale.controller.ts
import mongoose from "mongoose";
import { Request, Response } from "express";
import type { IFlashSale } from "../models/flashsale.model";
import type { IProduct } from "../models/product.model";
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

        // check product quantity
        if (product.productQuantity < data.flashSaleQuantity) {
            return res.status(400).json({
                status: false,
                message: "Not enought products int the stock",
            });
        }

        const sale = await FlashSale.create(data);

        // updating product quantity
        await Product.findByIdAndUpdate(data?.productId, {
            productQuantity: product.productQuantity - data.flashSaleQuantity,
        });

        // if valid Productid get the productData
        const productDetail = (await Product.findById(
            data.productId,
        )) as IProduct;

        const response = {
            ...sale.toObject(),
            productDetail: productDetail,
        };

        return res.status(200).json({
            status: true,
            message: "Sale Scheduled Successfully!",
            data: response,
        });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!",
        });
    }
};

export const getSingleSale = async (req: Request, res: Response) => {
    try {
        const { id } = req.params || null;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Sale id not provided!",
            });
        }

        const objectId = new mongoose.Types.ObjectId(id as string);
        if (!objectId) {
            return res.status(400).json({
                status: false,
                message: "Invalid sale id!",
            });
        }

        const sale = await FlashSale.aggregate([
            {
                $match: {
                    _id: objectId,
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

        if (!sale || sale.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Sale data not found!",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Sale data fetched successfully!",
            data: sale[0],
        });
    } catch (error: any) {
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
                    as: "productDetail",
                },
            },
            {
                $unwind: "$productDetail",
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

        return res.status(200).json({
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
            { $set: data },
            { new: true },
        );

        // get updated Product Info
        const product = await Product.findById(updatedData?.productId);
        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Invalid Product Id",
            });
        }
        const response = {
            ...updatedData?.toObject(),
            productDetail: product,
        };

        return res.status(200).json({
            status: true,
            message: "Sale updated successfully",
            data: response,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteSale = async (req: Request, res: Response) => {
    const session = await mongoose.startSession(); 
    try {
        session.startTransaction(); 
        const saleId = req.params.id || null; 
        if (!saleId) {
            await session.abortTransaction();  
            return res.status(400).json({
                status: false,
                message: "Sale Id not provided",
            });
        }

        const saleData = await FlashSale.findOne({_id: saleId}).session(session);  
        if (!saleData) {
            await session.abortTransaction(); 
            return res.status(400).json({
                status: false,
                message: "Invalid Sale Id",
            });
        }

        let stockQuantity = saleData.flashSaleQuantity; 
        if (stockQuantity > 0) {
            const productId = saleData?.productId;  
            const product = await Product.findOne({_id: productId}).session(session);
            if (!product) {
                await session.abortTransaction();  
                return res.status(400).json({
                    status: false, 
                    message: "Invalid Product Id"
                }); 
            }
            await Product.findByIdAndUpdate(
                {_id: productId}, 
                {
                    $set: {
                        productQuantity: product?.productQuantity + stockQuantity
                    }
                }, 
                {
                    new: true,
                    session: session
                }, 
            );  
        }
        await FlashSale.findByIdAndDelete(saleId).session(session);
        await session.commitTransaction();
        return res.status(200).json({
            status: true,
            message: "Sale deleted successfully",
        });
    } catch (error: any) {
        await session.abortTransaction(); 
        console.log(error.message);  
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    } finally {
        await session.endSession();  
    }
};
