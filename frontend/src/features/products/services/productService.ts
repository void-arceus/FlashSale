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
            error.reponse?.data?.message || "Failed to fetch products";
        return { status: false, message: message };
    }
};
