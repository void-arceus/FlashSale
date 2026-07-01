// productService.ts

import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface Product {
    _id: string;
    productName: string;
    description: string;
    originalPrice: number;
    salePrice: number;
    quantity: number;
    url: string;
    category: string;
    saleStartTime: string;
    saleEndTime: string;
    createdAt: string;
    updatedAt: string;
}

export const addProduct = async (
    data: any,
): Promise<{ status: boolean; message: string }> => {
    try {
        const result = await axios.post(`${BASE_URL}/product/add`, data);
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
    data?: Product;
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/product/products/${adminId}`);
        const message = "Products Fetched Successfully";
        return {
            status: true,
            message: message,
            data: res.data.data as Product,
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
    data?: Product;
    message?: string;
}> => {
    try {
        const res = await axios.get(`${BASE_URL}/product/products`);
        return { status: true, data: res.data.data as Product };
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Failed to fetch products";
        return { status: false, message: message };
    }
};
