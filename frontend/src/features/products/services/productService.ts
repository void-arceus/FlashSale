// productService.ts

import axios from "axios";
import type { UpdatePayload } from "../../admin/pages/AddProduct";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface IProduct {
    _id: string;
    productName: string;
    productDescription: string;
    productOriginalPrice: number;
    productQuantity: number;
    productImageUrl: string;
    productCategory: string;
}

export const addProduct = async (
    data: any,
): Promise<{ status: boolean; message: string }> => {
    try {
        await axios.post(`${BASE_URL}/product/add`, data);
        const message = "Product added successfully";
        return { status: true, message: message };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to add product";
        return { status: false, message: message };
    }
};

// get admin products
export const getAdminProducts = async (
    adminId: string,
): Promise<{
    status: boolean;
    message: string;
    data?: IProduct[];
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/product/products/${adminId}`);
        const message = "Products Fetched Successfully";
        return {
            status: true,
            message: message,
            data: res.data.data as IProduct[],
        };
    } catch (error: any) {
        const message = error.response?.data?.message || "something went wrong";
        return {
            status: false,
            message: message,
        };
    }
};
// get all products
export const getProducts = async (): Promise<{
    status: boolean;
    data?: IProduct[];
    message?: string;
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/product/products`);
        return { status: true, data: res.data.data as IProduct[] };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to fetch products";
        return { status: false, message: message };
    }
};

// delete product
export const deleteProduct = async (
    id: string,
): Promise<{ status: boolean; message: string }> => {
    try {
        await axios.post(`${BASE_URL}/product/delete/${id}`);
        const message = "Product deleted Successfully!";
        return { status: true, message: message };
    } catch (error: any) {
        const message =
            error.resopnse?.data?.message || "Something went wrong!";
        return { status: false, message: message };
    }
};

// update product info
export const updateProduct = async (
    id: string,
    data: UpdatePayload,
): Promise<{ status: boolean; message: string }> => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/product/product/${id}`,
            data,
        );
        const message = res.data?.message || "Product updated successfully";
        return {
            status: true,
            message: message,
        };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to updated Product Data";
        return { status: false, message: message };
    }
};
